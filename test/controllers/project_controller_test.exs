defmodule Poker.ProjectControllerTest do
  use Poker.ConnCase

  import TestHelper

  alias Poker.Project

  @valid_attrs %{name: "fooproj", display_name: "FooProj", private: false}
  @empty_attrs %{}

  setup %{conn: conn} do
    %{user: user, org: org, project: project} = sample_setup()

    conn =
      conn
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn, user: user, org: org, project: project}
  end

  test "lists all entries on index", %{conn: conn, org: org} do
    conn = get conn, organization_project_path(conn, :index, org.id)

    res = json_response(conn, 200)["data"]
    assert List.first(res)["id"]
  end

  test "shows chosen resource", %{conn: conn, org: org, project: project} do
    conn = get conn, organization_project_path(conn, :show, org.id, project.id)
    assert json_response(conn, 200)["data"]["id"] == Integer.to_string(project.id)
  end

  test "renders page not found when id is nonexistent", %{conn: conn, org: org} do
    assert_error_sent 404, fn ->
      get conn, organization_project_path(conn, :show, org.id, -1)
      json_response(conn, 200)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn, org: org} do
    conn = conn_with_token(conn)

    data = %{data: %{attributes: @valid_attrs}}
    conn = post conn, organization_project_path(conn, :create, org.id), data

    res = json_response(conn, 201)
    assert res["data"]["id"]
    assert Repo.get(Project, res["data"]["id"])
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn, org: org} do
    conn = conn_with_token(conn)

    data = %{data: %{attributes: @empty_attrs}}
    conn = post conn, organization_project_path(conn, :create, org.id), data
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn, org: org, project: project} do
    conn = conn_with_token(conn)

    data = %{data: %{attributes: @valid_attrs}}
    conn = put conn, organization_project_path(conn, :update, org.id, project.id), data
    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get(Project, project.id)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    project = Repo.insert! %Project{}
    conn = put conn, project_path(conn, :update, project), project: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    project = Repo.insert! %Project{}
    conn = delete conn, project_path(conn, :delete, project)
    assert response(conn, 204)
    refute Repo.get(Project, project.id)
  end

  # Helpers

  defp sample_setup do
    user =
      generate_users(1)
      |> List.first

    org =
      generate_orgs(1)
      |> List.first

    generate_membership(org.id, user.id)

    project = generate_project(org.id, "planning-poker")

    %{user: user, org: org, project: project}

    # |> Enum.map(fn org ->
    #   Repo.insert! Organization.registration_changeset %Organization{}, org
    # end)
    # |>

    # user_params = %{"username" => "foobar", "email" => "foobar@example.com",
    #                 "password" => "123456", "password_confirmation" => "123456"}

    # user = Repo.insert! User.registration_changeset %User{}, user_params

    # role_params = %{"organization_id" => spider.id, "user_id" => user.id, "role" => "owner"}
    # Repo.insert! OrganizationMember.registration_changeset %OrganizationMember{}, role_params
  end

  # defp with_token(conn) do
  #   token_conn = post conn, session_path(conn, :create, username: "foobar",
  #                                                       password: "123456")
  #   token = json_response(token_conn, 200)["token"]

  #   conn
  #   |> put_req_header("authorization", token)
  # end
end
