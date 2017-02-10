defmodule Poker.OrganizationMembershipController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{User, OrganizationMembership, UserView}

  plug :preload_session when action in [:create, :update, :delete, :add_to_organization,
                                        :remove_from_organization]
  plug JaResource

  # Scope

  def records(conn) do
    default = scope conn, OrganizationMembership

    case nested_resource(conn) do
      {"organizations", id} ->
        from m in default,
          where: m.organization_id == ^id

      _ ->
        default
    end
  end

  def record(conn, user_id) do
    with {"organizations", org_id} <- nested_resource(conn) do
      conn
      |> records
      |> Repo.get_by(organization_id: org_id, user_id: user_id)
    end
  end

  # Handlers

  def handle_create(conn, %{"user_id" => user_id}) do
    with {"organizations", org_id} <- nested_resource(conn) do
      attributes = %{
        organization_id: org_id,
        user_id: user_id,
        role: "member"
      }

      to_validate = Map.merge %OrganizationMembership{}, attributes
      authorize! conn, to_validate

      changeset = OrganizationMembership.create_changeset %OrganizationMembership{}, attributes

      membership = repo.insert! changeset

      user = User
             |> preload(:profile)
             |> Repo.get!(user_id)

      %{membership | user: user}
    end
  end

  def handle_update(conn, membership, attributes) do
    authorize! conn, membership

    OrganizationMembership.update_changeset membership, attributes
  end

  def handle_delete(conn, nil), do: nil # 404
  def handle_delete(conn, %{user_id: user_id}) do
    with {"organizations", org_id} <- nested_resource(conn) do
      membership = OrganizationMembership
                   |> Repo.get_by(user_id: user_id, organization_id: org_id)

      authorize! conn, membership

      super conn, membership
    end
  end

  # Filters

  filterable_by ["id", "username"]
end
