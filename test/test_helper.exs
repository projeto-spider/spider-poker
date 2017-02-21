ExUnit.start

Ecto.Adapters.SQL.Sandbox.mode(Poker.Repo, :manual)

defmodule TestHelper do
  use Poker.ConnCase
  alias Poker.{User, Organization, OrganizationMember, Project, Repo}

  def generate_users(max \\ 1) do
    [
      %{"username" => "foobar", "email" => "foobar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "barbar", "email" => "barbar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "bazbar", "email" => "bazbar@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
    ]
    |> Enum.take(max)
    |> Enum.map(fn user ->
      User.create_changeset(%User{}, user)
      |> Repo.insert!
    end)
  end

  def generate_orgs(max \\ 1) do
    [
      %{"name" => "projeto-spider", "display_name" => "Projeto Spider"}
    ]
    |> Enum.take(max)
    |> Enum.map(fn org ->
      Organization.create_changeset(%Organization{}, org)
      |> Repo.insert!
    end)
  end

  def generate_membership(org_id, user_id, role \\ "member") do
    data = %{"organization_id" => org_id, "user_id" => user_id, "role" => role}

    OrganizationMember.create_changeset(%OrganizationMember{}, data)
    |> Repo.insert!
  end

  def generate_project(org_id, name, private \\ false) do
    org = Repo.get! Organization, org_id
    data = %{"name" => name, "display_name" => name,
             "organization" => org, "private" => private}

    Project.create_changeset(%Project{}, data)
    |> Repo.insert!
  end

  def conn_with_token(conn) do
    token_conn = post conn, session_path(conn, :create, username: "foobar",
                                                        password: "123456")
    token = json_response(token_conn, 200)["token"]

    conn
    |> put_req_header("authorization", token)
  end
end
