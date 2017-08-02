defmodule App.Web.MemberControllerTest do
  use App.Web.ConnCase

  alias App.Accounts
  alias App.Projects
  alias App.Projects.Member

  @manager_attrs %{name: "some manager", email: "manager@example.com", password: "123456"}
  @user_attrs %{name: "some user", email: "user@example.com", password: "123456"}

  defp get_token(conn, data) do
    conn = post conn, session_path(conn, :create), data: data
    json_response(conn, 201)["data"]["token"]
  end

  setup %{conn: conn} do
    base_conn = put_req_header(conn, "accept", "application/json")

    {:ok, manager} = Accounts.create_user(@manager_attrs)
    {:ok, user} = Accounts.create_user(@user_attrs)
    {:ok, project} = Projects.create_project(%{name: "some project"}, manager)

    conn = put_req_header(base_conn, "authorization", get_token(base_conn, @manager_attrs))

    {:ok, conn: conn, manager: manager, user: user, project: project}
  end

  test "lists all members of project", %{conn: conn, project: project, manager: manager} do
    conn = get conn, project_member_path(conn, :index, project.id)
    assert [user] = json_response(conn, 200)["data"]
    assert user["id"] == manager.id
  end

  test "doesn't lists if you're not a member of this project", %{conn: conn, project: project} do
    conn = put_req_header(conn, "authorization", get_token(conn, @user_attrs))
    conn = get conn, project_member_path(conn, :index, project.id)
    assert json_response(conn, 404)["error"]
  end

  test "add member and renders member when data is valid", %{conn: conn, project: project, user: user} do
    conn = post conn, project_member_path(conn, :create, project.id), data: %{"user_id": user.id}
    assert %{"id" => id} = json_response(conn, 201)["data"]
    assert id == user.id
    assert true == Projects.member?(project.id, user.id)
  end

  test "does not add member and renders errors when data is invalid", %{conn: conn, project: project, manager: manager} do
    conn = post conn, project_member_path(conn, :create, project.id), data: %{"user_id" => manager.id}
    assert json_response(conn, 400)["error"]
  end

  test "removes chosen member", %{conn: conn, project: project, user: user} do
    {:ok, %Member{}} = Projects.add_member(project.id, user.id)
    conn = delete conn, project_member_path(conn, :delete, project.id, user.id)
    assert response(conn, 204)
    assert false == Projects.member?(project.id, user.id)
  end

  test "you can leave a project even when you're not the manager", %{conn: conn, manager: me, user: other_user} do
    assert {:ok, project} = Projects.create_project(%{name: "other project"}, other_user)
    assert {:ok, _member} = Projects.add_member(project.id, me.id)
    conn = delete conn, project_member_path(conn, :delete, project.id, me.id)
    assert response(conn, 204)
    assert false == Projects.member?(project.id, me.id)
  end
end
