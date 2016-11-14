defmodule Poker.SessionController do
  use Poker.Web, :controller

  alias Poker.User
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  def create(conn, %{"username" => username, "password" => password}) do
    user = Repo.get_by User, username: username
    check_user(conn, user, password)
  end
  def create(conn, %{"email" => email, "password" => password}) do
    user = Repo.get_by User, email: email
    check_user(conn, user, password)
  end

  def delete(conn, %{"id" => id}) do
    session = Repo.get!(Session, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(session)

    send_resp(conn, :no_content, "")
  end

  # Helpers

  def check_user(conn, user, password) do
    cond do
      user && checkpw(password, user.password_hash) ->
        {:ok, jwt, _} = encode_and_sign(user, :api)
        render(conn, "token.json", token: jwt)
      user ->
        conn
        |> send_resp(:unauthorized, "Wrong password")
      true ->
        dummy_checkpw
        conn
        |> send_resp(:unauthorized, "User doesn't exist")
    end
  end
end
