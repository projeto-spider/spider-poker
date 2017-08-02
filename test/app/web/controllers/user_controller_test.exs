defmodule App.Web.UserControllerTest do
  use App.Web.ConnCase

  alias App.Accounts
  alias App.Accounts.User

  @create_attrs %{email: "foobar@example.com", name: "foobar", password: "some password"}
  @update_attrs %{email: "foobaz@example.com", name: "foobaz", password: "other password"}
  @invalid_attrs %{email: nil, name: nil}

  def fixture(:user, attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(@create_attrs)
      |> Accounts.create_user()

    user
  end
  defp get_token(conn, user) do
    data = %{"email" => user.email, "password" => @create_attrs.password}
    conn = post conn, session_path(conn, :create), data: data
    json_response(conn, 201)["data"]["token"]
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    user = fixture(:user)
    conn = get conn, user_path(conn, :index)
    assert [response_user] = json_response(conn, 200)["data"]
    assert response_user["id"] == user.id
  end

  test "creates user and renders user when data is valid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), data: @create_attrs
    assert %{"id" => id} = json_response(conn, 201)["data"]

    conn = get conn, user_path(conn, :show, id)
    assert json_response(conn, 200)["data"] == %{
      "id" => id,
      "email" => @create_attrs.email,
      "name" => @create_attrs.name}
  end

  test "does not create user and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, user_path(conn, :create), data: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates chosen user and renders user when data is valid", %{conn: conn} do
    %User{id: id} = user = fixture(:user)
    conn = put_req_header conn, "authorization", get_token(conn, user)
    conn = put conn, user_path(conn, :update, user), data: @update_attrs
    assert %{"id" => ^id} = json_response(conn, 200)["data"]

    conn = get conn, user_path(conn, :show, id)
    assert json_response(conn, 200)["data"] == %{
      "id" => id,
      "email" => @update_attrs.email,
      "name" => @update_attrs.name}
  end

  test "does not update users if not authenticated", %{conn: conn} do
    user = fixture(:user)
    conn = put conn, user_path(conn, :update, user), data: @update_attrs
    assert json_response(conn, 401)["error"]
  end

  test "does not update users other than self", %{conn: conn} do
    user = fixture(:user)
    other = fixture(:user, @update_attrs)
    conn = put_req_header conn, "authorization", get_token(conn, user)
    conn = put conn, user_path(conn, :update, other), data: @update_attrs
    assert json_response(conn, 401)["error"]
  end

  test "does not update chosen user and renders errors when data is invalid", %{conn: conn} do
    user = fixture(:user)
    conn = put_req_header conn, "authorization", get_token(conn, user)
    conn = put conn, user_path(conn, :update, user), data: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen user", %{conn: conn} do
    user = fixture(:user)
    conn = put_req_header conn, "authorization", get_token(conn, user)
    conn = delete conn, user_path(conn, :delete, user)
    assert response(conn, 204)
    assert_error_sent 404, fn ->
      get conn, user_path(conn, :show, user)
    end
  end

  test "does not delete users if not authenticated", %{conn: conn} do
    user = fixture(:user)
    conn = delete conn, user_path(conn, :delete, user)
    assert json_response(conn, 401)["error"]
  end

  test "does not delete users other than self", %{conn: conn} do
    user = fixture(:user)
    other = fixture(:user, @update_attrs)
    conn = put_req_header conn, "authorization", get_token(conn, user)
    conn = delete conn, user_path(conn, :delete, other)
    assert json_response(conn, 401)["error"]
  end
end
