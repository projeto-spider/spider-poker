defmodule App.Web.ProjectControllerTest do
  use App.Web.ConnCase

  alias App.Accounts
  alias App.Projects
  alias App.Projects.Project
  alias App.Projects.Story

  @create_attrs %{name: "some name", votation_time: 3}
  @update_attrs %{name: "other name", votation_time: 4}
  @invalid_attrs %{name: nil, votation_time: nil}

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

  setup %{conn: conn} do
    base_conn = put_req_header(conn, "accept", "application/json")

    user = user_fixture()

    data = %{"email": "user@example.com", "password": "123456"}
    conn = post base_conn, session_path(base_conn, :create), data: data
    %{"token" => token} = json_response(conn, 201)["data"]

    conn = put_req_header(base_conn, "authorization", token)

    {:ok, conn: conn, user: user}
  end

  test "lists user projects on index", %{conn: conn, user: user} do
    project = project_fixture(user)
    conn = get conn, project_path(conn, :index)
    assert [first] = json_response(conn, 200)["data"]
    assert first["id"] == project.id
  end

  test "do not list projects you don't participate on index", %{conn: conn} do
    other_user = other_user_fixture()
    project_fixture(other_user)
    conn = get conn, project_path(conn, :index)
    assert [] = json_response(conn, 200)["data"]
  end

  test "do not show project you aren't member of", %{conn: conn} do
    other_user = other_user_fixture()
    assert {:ok, project} = Projects.create_project(@create_attrs, other_user)
    conn = get conn, project_path(conn, :show, project)
    assert json_response(conn, 404)["error"]
  end

  test "creates project and renders project when data is valid", %{conn: conn} do
    conn = post conn, project_path(conn, :create), data: @create_attrs
    assert %{"id" => id} = json_response(conn, 201)["data"]

    Projects.get_project!(id)
  end

  test "does not create project and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, project_path(conn, :create), data: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates chosen project and renders project when data is valid", %{conn: conn, user: user} do
    %Project{id: id} = project = project_fixture(user)
    conn = put conn, project_path(conn, :update, project), data: @update_attrs
    assert %{"id" => ^id} = json_response(conn, 200)["data"]

    project = Projects.get_project!(id)
    assert project.name == @update_attrs.name
    assert project.votation_time == @update_attrs.votation_time
  end

  test "does not update project if not authenticated", %{user: user} do
    %Project{} = project = project_fixture(user)
    conn = put %Plug.Conn{}, project_path(%Plug.Conn{}, :update, project), data: @update_attrs
    assert json_response(conn, 401)["error"]
  end

  test "does not update projects if you're not member", %{conn: conn, user: user} do
    other_user = other_user_fixture()
    project = project_fixture(other_user)
    conn = put conn, project_path(conn, :update, project), data: @update_attrs
    assert json_response(conn, 401)["error"]
    refute Projects.member?(project.id, user.id)
  end

  test "does not update projects if you're not manager", %{conn: conn, user: user} do
    other_user = other_user_fixture()
    project = project_fixture(other_user)
    Projects.add_member(project.id, user.id)
    conn = put conn, project_path(conn, :update, project), data: @update_attrs
    assert json_response(conn, 401)["error"]
  end

  test "does not update chosen project and renders errors when data is invalid", %{conn: conn, user: user} do
    project = project_fixture(user)
    conn = put conn, project_path(conn, :update, project), data: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen project", %{conn: conn, user: user} do
    project = project_fixture(user)
    conn = delete conn, project_path(conn, :delete, project)
    assert response(conn, 204)
    assert_raise Ecto.NoResultsError, fn ->
      Projects.get_project!(project.id)
    end
  end

  test "does not delete users if not authenticated", %{user: user} do
    project = project_fixture(user)
    conn = delete %Plug.Conn{}, project_path(%Plug.Conn{}, :delete, project)
    assert json_response(conn, 401)["error"]
  end

  test "does not delete projects if you're not member", %{conn: conn, user: user} do
    other_user = other_user_fixture()
    project = project_fixture(other_user)
    conn = delete conn, project_path(conn, :delete, project)
    assert json_response(conn, 401)["error"]
    refute Projects.member?(project.id, user.id)
  end

  test "does not delete projects if you're not manager", %{conn: conn, user: user} do
    other_user = other_user_fixture()
    project = project_fixture(other_user)
    Projects.add_member(project.id, user.id)
    conn = delete conn, project_path(conn, :delete, project)
    assert json_response(conn, 401)["error"]
  end

  test "get a project backlog", %{conn: conn, user: user} do
    project = project_fixture(user)
    {:ok, project, %Story{} = story_a} = Projects.unshift_story(project, %{title: "Foo"})
    {:ok, project, %Story{} = story_b} = Projects.unshift_story(project, %{title: "Bar"})

    conn = get conn, project_backlog_path(conn, :backlog, project)
    backlog = json_response(conn, 200)["data"]
    assert [story_b.id, story_a.id] == for story <- backlog, do: story["id"]
  end

  test "get a project backlog works with substories too", %{conn: conn, user: user} do
    project = project_fixture(user)
    {:ok, project, %Story{} = parent} = Projects.unshift_story(project, %{title: "Foo"})
    {:ok, parent, %Story{} = story_a} = Projects.unshift_story(parent, %{title: "Bar"})
    {:ok, parent, %Story{} = story_b} = Projects.unshift_story(parent, %{title: "Baz"})
    {:ok, parent, %Story{} = story_c} = Projects.unshift_story(parent, %{title: "Qux"})

    conn = get conn, project_backlog_path(conn, :backlog, project)
    backlog = json_response(conn, 200)["data"]

    received_parent = hd backlog
    assert received_parent["id"] == parent.id
    assert [story_c.id, story_b.id, story_a.id] == for story <- received_parent["children"], do: story["id"]
  end
end
