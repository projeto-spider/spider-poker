defmodule App.Web.SessionControllerTest do
  use App.Web.ConnCase

  alias App.Accounts

  @create_attrs %{"email" => "foobar@example.com", "password" => "123456"}
  @invalid_attrs %{"email" => "doesnt_exist@example.com", "password" => ""}

  def fixture(:user) do
    attrs = Map.put(@create_attrs, "name", "foobar")
    {:ok, user} = Accounts.create_user(attrs)
    user
  end
  def put_token(conn, token) do
    put_req_header(conn, "authorization", token)
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "creates session and renders session when data is valid", %{conn: base_conn} do
    user = fixture(:user)

    conn = post base_conn, session_path(base_conn, :create), data: @create_attrs
    assert %{"token" => token} = json_response(conn, 201)["data"]

    conn = put_token base_conn, token
    conn = get conn, session_path(conn, :show)
    assert json_response(conn, 200)["data"]["id"] == user.id
  end

  test "does not create session and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, session_path(conn, :create), data: @invalid_attrs
    assert json_response(conn, 401)["error"]
  end

  test "do not show session when unauthorized", %{conn: conn} do
    conn = get conn, session_path(conn, :show)
    assert json_response(conn, 401)["error"]
  end
end
