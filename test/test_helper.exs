ExUnit.start

Ecto.Adapters.SQL.Sandbox.mode(Poker.Repo, :manual)

defmodule TestHelper do
  use Poker.ConnCase
  alias Poker.{User, Repo}

  def generate_users do
    users = [
      %{"username" => "foobar", "email" => "foobar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "barbar", "email" => "barbar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "bazbar", "email" => "bazbar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
    ]

    users
    |> Enum.map(fn user ->
      User.registration_changeset(%User{}, user)
      |> Repo.insert!
    end)
  end

  def conn_with_token(conn) do
    token_conn = post conn, session_path(conn, :create, username: "foobar",
                                                        password: "123456")
    token = json_response(token_conn, 200)["token"]

    conn
    |> put_req_header("authorization", token)
  end
end
