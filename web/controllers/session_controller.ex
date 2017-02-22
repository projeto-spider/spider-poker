defmodule Poker.SessionController do
  use Poker.Web, :controller

  alias Poker.{User, Profile, UserView, ErrorView}
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  plug :preload_session when action in [:show]
  plug :ensure_authenticated when action in [:show]

  def show(%{assigns: %{current_user: user}} = conn, _params)
  when user != nil do
    profile =
      from(p in Profile, where: p.user_id == ^user.id)
      |> Repo.one!

    user = Map.put(user, :profile, profile)
    render conn, UserView, "show.json", data: user
  end

  def create(conn, %{"data" => %{"username" => username, "password" => password}}) do
    user = Repo.get_by User, username: username
    check_user(conn, user, password)
  end
  def create(conn, %{"data" => %{"email" => email, "password" => password}}) do
    user = Repo.get_by User, email: email
    check_user(conn, user, password)
  end

  # Helpers

  def check_user(conn, user, password) do
    cond do
      user && checkpw(password, user.password_hash) ->
        {:ok, jwt, _} = encode_and_sign(user, :api)
        render(conn, "token.json", token: jwt)

      user ->
        conn
        |> put_status(401)
        |> render(ErrorView, "401.json", message: "Wrong password")

      true ->
        dummy_checkpw()

        conn
        |> put_status(401)
        |> render(ErrorView, "401.json", message: "User doesn't exists")
    end
  end
end
