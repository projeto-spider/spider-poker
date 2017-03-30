defmodule Poker.Web.SessionController do
  use Poker.Web, :controller

  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]
  import Guardian, only: [encode_and_sign: 2]
  alias Poker.{User, Profile}
  alias Poker.Web.UserView

  plug :flatten_param, "data"
    when action == :create

  def show(conn, _params) do
    with :ok <- authorize(conn, :show) do
      user    = conn.assigns[:current_user]
      profile = Repo.get_by(Profile, user_id: user.id)
      user    = Map.put(user, :profile, profile)
      render(conn, UserView, "show.json", data: user)
    end
  end

  def create(conn, %{"username" => username, "password" => password}) do
    user = Repo.get_by(User, username: username)
    do_create(conn, user, password)
  end
  def create(conn, %{"email" => email, "password" => password}) do
    user = Repo.get_by(User, email: email)
    do_create(conn, user, password)
  end

  defp do_create(conn, user, password) do
    with :ok                  <- authorize(conn, :create),
         {:ok, {jwt, expiry}} <- check_user(user, password)
    do
      render(conn, "token.json", token: jwt, expiry: expiry)
    end
  end

  defp check_user(user, password) do
    cond do
      user && checkpw(password, user.password_hash) ->
        {:ok, jwt, %{"exp" => expiry}} = encode_and_sign(user, :api)
        {:ok, {jwt, expiry}}

      user ->
        {:error, {:unauthorized, "Wrong Password"}}

      :otherwise ->
        dummy_checkpw()
        {:error, {:unauthorized, "User doesn't exists"}}
    end
  end
end
