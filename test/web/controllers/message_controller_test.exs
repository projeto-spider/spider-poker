defmodule Poker.MessageControllerTest do
  use Poker.ConnCase
  import TestHelper
  alias Poker.Message

  @valid_attrs %{"to_user" => "barbar", "content" => "foo"}
  @invalid_attrs %{"to" => "noone"}

  setup %{conn: conn} do
    generate_users
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = conn_with_token conn
    conn = get conn, user_message_path(conn, :index, "foobar")
    assert json_response(conn, 200)["data"] == []
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = conn_with_token conn
    conn = post conn, message_path(conn, :create), message: @valid_attrs
    assert response(conn, 201)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = conn_with_token conn
    conn = post conn, message_path(conn, :create), message: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    message = Repo.insert! %Message{}
    conn = conn_with_token conn
    conn = put conn, user_message_path(conn, :update, "foobar", message), message: @valid_attrs
    id = json_response(conn, 200)["data"]["id"]
    assert id
    assert Repo.get(Message, id)
  end
end
