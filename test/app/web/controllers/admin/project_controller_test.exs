defmodule App.Web.Admin.ProjectControllerTest do
  use App.Web.ConnCase

  alias App.Accounts
  alias App.Accounts.User
  alias App.Projects
  alias App.Projects.Project

  @create_attrs %{name: "some name", votation_time: 3}
  @update_attrs %{name: "other name", votation_time: 4}

  def project_fixture(manager, attrs \\ %{}) do
    {:ok, project} =
      attrs
      |> Enum.into(@create_attrs)
      |> Projects.create_project(manager)
    project
  end

  def user_fixture(attrs \\ %{}) do
    base_attrs = %{name: "some user", email: "user@example.com", password: "123456"}
    {:ok, user} =
      attrs
      |> Enum.into(base_attrs)
      |> Accounts.create_user()

    user
  end

  def other_user_fixture(attrs \\ %{}) do
    base_attrs = %{name: "other user", email: "other@example.com", password: "123456"}
    user_fixture(Enum.into(attrs, base_attrs))
  end

  defp get_token(conn, data) do
    conn = post conn, session_path(conn, :create), data: data
    json_response(conn, 201)["data"]["token"]
  end

  setup %{conn: conn} do
    base_conn = put_req_header(conn, "accept", "application/json")

    user = user_fixture()
    {:ok, user} = Accounts.full_update_user(user, %{admin?: true})

    data = %{"email": "user@example.com", "password": "123456"}
    conn = put_req_header(base_conn, "authorization", get_token(conn, data))

    {:ok, conn: conn, user: user}
  end

  test "lists projects on index", %{conn: conn, user: user} do
    project = project_fixture(user)
    conn = get conn, admin_project_path(conn, :index)
    assert [first] = json_response(conn, 200)["data"]
    assert first["id"] == project.id
  end

  test "updates chosen project and renders project when data is valid", %{conn: conn, user: user} do
    %Project{id: id} = project = project_fixture(user)
    conn = put conn, admin_project_path(conn, :update, project), data: @update_attrs
    assert %{"id" => ^id} = json_response(conn, 200)["data"]

    project = Projects.get_project!(id)
    assert project.name == @update_attrs.name
    assert project.votation_time == @update_attrs.votation_time
  end

  test "does not update project if not admin" do
    %User{} = user = other_user_fixture()
    data = %{"email" => "other@example.com", "password" => "123456"}
    conn = put_req_header(%Plug.Conn{}, "authorization", get_token(%Plug.Conn{}, data))

    %Project{} = project = project_fixture(user)
    conn = put conn, admin_project_path(conn, :update, project), data: @update_attrs
    assert json_response(conn, 400)["error"]
  end

  test "deletes chosen project", %{conn: conn, user: user} do
    project = project_fixture(user)
    conn = delete conn, admin_project_path(conn, :delete, project)
    assert response(conn, 204)
    assert_raise Ecto.NoResultsError, fn ->
      Projects.get_project!(project.id)
    end
  end

  test "does not delete project if not admin" do
    %User{} = user = other_user_fixture()
    data = %{"email" => "other@example.com", "password" => "123456"}
    conn = put_req_header(%Plug.Conn{}, "authorization", get_token(%Plug.Conn{}, data))

    %Project{} = project = project_fixture(user)
    conn = delete conn, admin_project_path(conn, :delete, project)
    assert json_response(conn, 400)["error"]
  end
end
