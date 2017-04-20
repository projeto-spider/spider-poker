defmodule Poker.SessionControllerTest do
  use Poker.ConnCase

  alias Poker.User
  @user_fixture %{"username" => "fixture", "password" => "fixture",
                 "password_confirmation" => "fixture",
                 "email" => "fixture@gmail.com"}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "get session token", %{conn: conn} do
    changeset = User.registration_changeset %User{}, @user_fixture
    Repo.insert! changeset

    conn = post conn, session_path(conn, :create, username: "fixture",
                                                  password: "fixture")
    assert json_response(conn, 200)["token"]
  end
end
