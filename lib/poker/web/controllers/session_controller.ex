defmodule Poker.Web.SessionController do
  use Poker.Web, :controller

  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]
  import Guardian, only: [encode_and_sign: 2]
  alias Poker.Accounts
  alias Poker.Web.UserView

  plug :flatten_param, "data"
    when action == :create

  def show(conn, _params) do
    with {:ok, user} <- Session.user(conn) do
      render(conn, UserView, "show.json", data: user)
    end
  end

  def create(conn, ~m{username, password}) do
    with {:ok, user} <- Accounts.get(username) do
      do_create(conn, user, password)
    end
  end
  def create(conn, ~m{email, password}) do
    with {:ok, user} <- Accounts.get_by(email: email) do
      do_create(conn, user, password)
    end
  end

  defp do_create(conn, user, password) do
    with {:ok, {jwt, expiry}} <- check_user(user, password) do
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
