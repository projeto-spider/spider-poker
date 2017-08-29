defmodule App.Web.Session do
  @moduledoc """
  Abstraction for handling API sessions easily.
  """

  @provider %{
    github: 1,
    google: 2,
    facebook: 3
  }

  alias Comeonin.Bcrypt
  alias Plug.Conn
  alias Phoenix.Token
  alias App.Repo
  alias App.Accounts
  alias App.Accounts.User

  @doc """
  Return the current_user in session if any
  """
  def current_user(conn) do
    with {:ok, token} <- get_token(conn),
         {:ok, user_id} <- verify_token(token) do
      {:ok, Accounts.get_user!(user_id)}
    else
      _ -> {:error, :"401"}
    end
  end

  @doc """
  Verify credentials then generate a Phoenix.Token
  """
  def create_session(%{"email" => email, "password" => password}) do
    case Repo.get_by(User, email: email, auth_provider: 0) do
      %User{id: user_id, password_hash: hash} ->
        if check_password(password, hash) do
          {:ok, generate_token(user_id)}
        else
          :error
        end

      _ ->
        Bcrypt.dummy_checkpw()
        :error
    end
  end

  @doc """
  Social auth
  """
  def social_auth("github", %{"id" => id, "name" => name,
                                      "email" => email, "avatar_url" => avatar}) do
    auth_id = Integer.to_string(id)

    case Repo.get_by(User, auth_provider: @provider.github, auth_id: auth_id) do
      %User{} = user ->
        with {:ok, user} <- Accounts.update_user(user, %{avatar: avatar}) do
          {:ok, generate_token(user.id)}
        end
      
      _ ->
        params = %{
          name: name,
          email: email,
          avatar: avatar,
          password: "dummypass :D",
          auth_provider: @provider.github,
          auth_id: auth_id
        }
        operation = Accounts.create_user_by_social_auth(@provider.github, auth_id, params)
        with {:ok, %User{id: user_id}} <- operation do
          {:ok, generate_token(user_id)}
        end
    end
  end
  def social_auth("google", %{"sub" => auth_id, "name" => name,
                                      "email" => email, "picture" => avatar}) do
    case Repo.get_by(User, auth_provider: @provider.google, auth_id: auth_id) do
      %User{} = user ->
        with {:ok, user} <- Accounts.update_user(user, %{avatar: avatar}) do
          {:ok, generate_token(user.id)}
        end
      
      _ ->
        params = %{
          name: name,
          email: email,
          avatar: avatar,
          password: "dummypass :D",
          auth_provider: @provider.google,
          auth_id: auth_id
        }
        operation = Accounts.create_user_by_social_auth(@provider.google, auth_id, params)
        with {:ok, %User{id: user_id}} <- operation do
          {:ok, generate_token(user_id)}
        end
    end
  end
  def social_auth("facebook", %{"id" => auth_id, "name" => name,
                                        "email" => email, "picture" => picture} = foo) do
    case Repo.get_by(User, auth_provider: @provider.facebook, auth_id: auth_id) do
      %User{} = user ->
        with {:ok, user} <- Accounts.update_user(user, %{avatar: picture["data"]["url"]}) do
          {:ok, generate_token(user.id)}
        end
      
      _ ->
        params = %{
          name: name,
          email: email,
          avatar: picture["data"]["url"],
          password: "dummypass :D",
          auth_provider: @provider.facebook,
          auth_id: auth_id
        }
        operation = Accounts.create_user_by_social_auth(@provider.facebook, auth_id, params)
        with {:ok, %User{id: user_id}} <- operation do
          {:ok, generate_token(user_id)}
        end
    end
  end

  @doc """
  Check if given session token is valid

  ## Examples

      iex> verify_token(valid_token)
      {:ok, %User{}}

      iex> verify_token(invalid_token)
      {:error, reason}
  """
  def verify_token(token), do: Token.verify(App.Web.Endpoint, "user", token)

  defp get_token(conn) do
    case Conn.get_req_header(conn, "authorization") do
      [token] -> {:ok, token}
      _ -> :error
    end
  end

  defp check_password(password, password_hash), do: Bcrypt.checkpw(password, password_hash)

  defp generate_token(user_id), do: Token.sign(App.Web.Endpoint, "user", user_id)
end
