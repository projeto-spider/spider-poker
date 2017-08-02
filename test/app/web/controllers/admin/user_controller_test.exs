defmodule App.Web.Admin.UserControllerTest do
  use App.Web.ConnCase

  alias App.Accounts
  alias App.Accounts.User

  @create_attrs %{name: "some user", email: "some@example.com", password: "123456"}
  @update_attrs %{name: "other user", email: "other@example.com"}

  def fixture(:user) do
    {:ok, user} = Accounts.create_user(@create_attrs)
    user
  end

  setup %{conn: base_conn} do
    conn = put_req_header(base_conn, "accept", "application/json")

    admin_attrs = %{name: "admin", email: "admin@example.com", password: "123456"}
    {:ok, admin} = Accounts.create_user(admin_attrs)
    {:ok, admin} = Accounts.full_update_user(admin, %{admin?: true})

    conn = put_req_header(conn, "authorization", get_token(conn, admin_attrs))
    {:ok, conn: conn, admin: admin}
  end
  defp get_token(conn, user) do
    data = %{"email" => user.email, "password" => user.password}
    conn = post conn, session_path(conn, :create), data: data
    json_response(conn, 201)["data"]["token"]
  end

  test "updates chosen user and renders user when data is valid", %{conn: conn} do
    %User{id: id} = user = fixture(:user)
    conn = put conn, admin_user_path(conn, :update, user), data: @update_attrs
    assert %{"id" => ^id} = json_response(conn, 200)["data"]

    updated = Accounts.get_user!(id)
    assert updated.name == @update_attrs.name
    assert updated.email == @update_attrs.email
  end

  test "you can't update anyone if you're not admin" do
    %User{} = user = fixture(:user)
    conn = put_req_header(%Plug.Conn{}, "authorization", get_token(%Plug.Conn{}, @create_attrs))

    conn = put conn, admin_user_path(conn, :update, user), data: @update_attrs
    assert json_response(conn, 400)["error"]
  end

  test "deletes chosen user even if it's not yourself", %{conn: conn} do
    user = fixture(:user)
    conn = delete conn, admin_user_path(conn, :delete, user)
    assert response(conn, 204)
    assert_error_sent 404, fn ->
      get conn, user_path(conn, :show, user)
    end
  end

  test "you can't delete anyone if you're not admin" do
    %User{} = user = fixture(:user)
    conn = put_req_header(%Plug.Conn{}, "authorization", get_token(%Plug.Conn{}, @create_attrs))

    conn = delete conn, admin_user_path(conn, :delete, user)
    assert json_response(conn, 400)["error"]
  end
end
