defmodule App.Web.Admin.MemberControllerTest do
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
    {:ok, project} = Projects.create_project(%{name: "some project"}, manager)
    {:ok, admin} = Accounts.create_user(@user_attrs)
    {:ok, admin} = Accounts.full_update_user(admin, %{admin?: true})

    conn = put_req_header(base_conn, "authorization", get_token(base_conn, @user_attrs))

    {:ok, conn: conn, manager: manager, admin: admin, project: project}
  end

  test "lists all members of project", %{conn: conn, project: project, manager: manager} do
    conn = get conn, admin_project_member_path(conn, :index, project.id)
    assert [user] = json_response(conn, 200)["data"]
    assert user["id"] == manager.id
  end

  test "doesn't lists if you're not an admin", %{conn: conn, project: project} do
    conn = put_req_header(conn, "authorization", get_token(conn, @manager_attrs))
    conn = get conn, admin_project_member_path(conn, :index, project.id)
    assert json_response(conn, 400)["error"]
  end

  test "add member and renders member when data is valid", %{conn: conn, project: project, admin: admin} do
    conn = post conn, admin_project_member_path(conn, :create, project.id), data: %{"user_id": admin.id}
    assert %{"id" => id} = json_response(conn, 201)["data"]
    assert id == admin.id
    assert true == Projects.member?(project.id, admin.id)
  end

  test "doesn't add member when you're not admin", %{conn: conn, project: project, admin: admin} do
    conn = put_req_header(conn, "authorization", get_token(conn, @manager_attrs))
    conn = post conn, admin_project_member_path(conn, :create, project.id), data: %{"user_id": admin.id}
    assert json_response(conn, 400)["error"]
    assert false == Projects.member?(project.id, admin.id)
  end

  test "removes chosen member", %{conn: conn, project: project, admin: admin} do
    {:ok, %Member{}} = Projects.add_member(project.id, admin.id)
    conn = delete conn, admin_project_member_path(conn, :delete, project.id, admin.id)
    assert response(conn, 204)
    assert false == Projects.member?(project.id, admin.id)
  end

  test "doesn't remove chosen member when you're not admin", %{conn: conn, project: project, admin: admin} do
    conn = put_req_header(conn, "authorization", get_token(conn, @manager_attrs))
    {:ok, %Member{}} = Projects.add_member(project.id, admin.id)
    conn = delete conn, admin_project_member_path(conn, :delete, project.id, admin.id)
    assert json_response(conn, 400)["error"]
    assert true == Projects.member?(project.id, admin.id)
  end
end
