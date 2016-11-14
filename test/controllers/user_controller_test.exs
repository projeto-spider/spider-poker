defmodule Poker.UserControllerTest do
  use Poker.ConnCase

  alias Poker.User
  @valid_attrs %{}
  @invalid_attrs %{}

  setup %{conn: conn} do
    setup_users
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, user_path(conn, :index)

    json_response(conn, 200)["data"]
    |> Enum.map(fn user ->
      assert user["username"]
    end)
  end

  test "shows chosen resource", %{conn: conn} do
    conn = get conn, user_path(conn, :show, "foobar")
    assert json_response(conn, 200)["data"]["username"] == "foobar"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, user_path(conn, :show, "santa-claus")
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), user: %{
      "username" => "quxbar", "email" => "quxbar@example.com",
      "password" => "123456", "password_confirmation" => "123456"
    }

    assert json_response(conn, 201)["data"]["username"]
    assert Repo.get_by(User, username: "quxbar")
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), user: %{"username" => "foo"}
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    conn = with_token(conn)

    conn = put conn, user_path(conn, :update, "foobar"), user: %{
      "profile" => %{"name" => "Foobar"}
    }

    assert json_response(conn, 200)["data"]["profile"]["name"] == "Foobar"

    user =  Repo.get_by(User.with_profile, username: "foobar")
    assert user.profile.name == "Foobar"
  end

  test "deletes chosen resource", %{conn: conn} do
    conn = with_token(conn)
    conn = delete conn, user_path(conn, :delete, "foobar")
    assert response(conn, 204)
    refute Repo.get_by(User, username: "foobar")
  end

  # Helpers

  defp setup_users do
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

  defp with_token(conn) do
    token_conn = post conn, session_path(conn, :create, username: "foobar",
                                                  password: "123456")
    token = json_response(token_conn, 200)["token"]

    conn
    |> put_req_header("authorization", token)
  end
end
