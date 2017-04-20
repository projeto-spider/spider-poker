defmodule Poker.NotificationControllerTest do
  use Poker.ConnCase

  alias Poker.{User, Notification}

  setup %{conn: conn} do
    users = setup_users

    {:ok, conn: put_req_header(conn, "accept", "application/json"),
          users: users}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = with_token conn
    conn = get conn, user_notification_path(conn, :index, "foobar")
    assert json_response(conn, 200)["data"] == []
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn,
                                                                   users: users} do
    user = hd users
    notification = Repo.insert! %Notification{user_id: user.id}

    conn = with_token conn
    conn = put conn, user_notification_path(conn, :update, user.username,
                                            notification.id),
                                            notification: %{"read" => true}
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get(Notification, notification.id).read == true
  end

  # Helpers

  defp setup_users do
    users = [
      %{"username" => "foobar", "email" => "foobar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "barbar", "email" => "barbar@example.com",
        "password" => "123456", "password_confirmation" => "123456"}
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
