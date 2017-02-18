defmodule Poker.SessionController do
  use Poker.Web, :controller

  alias Poker.{User, Profile, UserView, ErrorView}
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  plug :preload_session when action in [:show]
  plug :ensure_authenticated when action in [:show]

  def show(conn, _params) do
    user = conn.assigns.current_user

    profile = from(p in Profile, where: p.user_id == ^user.id)
              |> Repo.one!

    user = Map.put(user, :profile, profile)
    render conn, UserView, "show.json-api", data: user
  end

  def create(conn, %{"username" => username, "password" => password}) do
    user = Repo.get_by User, username: username
    check_user(conn, user, password)
  end
  def create(conn, %{"email" => email, "password" => password}) do
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
        |> render(ErrorView, "401.json-api", message: "Wrong password")

      true ->
        dummy_checkpw()

        conn
        |> put_status(401)
        |> render(ErrorView, "401.json-api", message: "User doesn't exists")
    end
  end
end
