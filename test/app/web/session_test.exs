defmodule App.Web.SessionTest do
  use App.Web.ConnCase, async: true

  alias Plug.Conn
  alias App.Accounts
  alias App.Accounts.User
  alias App.Web.Session

  @create_attrs %{"email" => "foobar@example.com", "password" => "123456"}
  @invalid_attrs %{"email" => "doesnt_exist@example.com", "password" => ""}

  def fixture(:user) do
    attrs = Map.put(@create_attrs, "name", "foobar")
    {:ok, user} = Accounts.create_user(attrs)
    user
  end
  def fixture(:token) do
    fixture(:user)
    {:ok, token} = Session.create_session(@create_attrs)
    token
  end

  test "view session when token is valid" do
    token = fixture(:token)
    conn = Conn.put_req_header(%Conn{}, "authorization", token)
    assert {:ok, %User{}} = Session.current_user(conn)
  end

  test "create session when credentials are valid" do
    fixture(:user)
    assert {:ok, _token} = Session.create_session(@create_attrs)
  end

  test "error when credentials are invalid" do
    assert :error = Session.create_session(@invalid_attrs)
  end
end
