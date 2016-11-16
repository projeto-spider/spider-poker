defmodule Poker.OrganizationControllerTest do
  use Poker.ConnCase

  alias Poker.{Organization, OrganizationUser, User}

  setup %{conn: conn} do
    sample_setup
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, organization_path(conn, :index)
    [sample | _] = json_response(conn, 200)["data"]
    assert sample["name"]
  end

  test "shows chosen resource", %{conn: conn} do
    conn = get conn, organization_path(conn, :show, "youtube")
    assert json_response(conn, 200)["data"]["name"] == "youtube"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, organization_path(conn, :show, "false")
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    attrs = %{"name" => "fixture"}
    conn = with_token(conn)
    conn = post conn, organization_path(conn, :create), organization: attrs
    data = json_response(conn, 201)["data"]
    assert data["name"] == "fixture"
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    attrs = %{"name" => "youtube"}
    conn = with_token(conn)
    conn = post conn, organization_path(conn, :create), organization: attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    attrs = %{"private" => false}
    conn = with_token(conn)
    conn = put conn, organization_path(conn, :update, "projeto-spider"), organization: attrs
    data = json_response(conn, 200)["data"]
    assert data["name"] == "projeto-spider"
    assert data["private"] == false
  end

  test "deletes chosen resource", %{conn: conn} do
    conn = with_token(conn)
    conn = delete conn, organization_path(conn, :delete, "projeto-spider")
    assert response(conn, 204)
    refute Repo.get_by(Organization, name: "projeto-spider")
  end

  # Helpers

  defp sample_setup do
    orgs = [
      %{"name" => "projeto-spider", "private" => true},
      %{"name" => "youtube"},
      %{"name" => "reddit"}
    ]

    [spider | _] = orgs
    |> Enum.map(fn org ->
      Repo.insert! Organization.registration_changeset %Organization{}, org
    end)

    user_params = %{"username" => "foobar", "email" => "foobar@example.com",
                    "password" => "123456", "password_confirmation" => "123456"}

    user = Repo.insert! User.registration_changeset %User{}, user_params

    role_params = %{"organization_id" => spider.id, "user_id" => user.id, "role" => "owner"}
    Repo.insert! OrganizationUser.registration_changeset %OrganizationUser{}, role_params
  end

  defp with_token(conn) do
    token_conn = post conn, session_path(conn, :create, username: "foobar",
                                                        password: "123456")
    token = json_response(token_conn, 200)["token"]

    conn
    |> put_req_header("authorization", token)
  end
end
