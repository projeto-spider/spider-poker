defmodule Poker.OrganizationController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{User, Organization, OrganizationMember}

  plug :ensure_authenticated when action in [:create, :update, :delete]
  plug :preload_session
  plug JaResource

  # Scope

  def record(conn, org_id) do
    scope(conn, Organization, org_id: org_id)
    |> Repo.one!
  end

  def records(conn) do
    scope conn, Organization
  end

  # Handlers

  def handle_create(conn, attributes) do
    changeset = Organization.create_changeset %Organization{}, attributes

    authorize! conn, Organization

    with {:ok, organization} <- Repo.insert(changeset) do
      owner = conn.assigns.current_user

      role_params = %{"organization_id" => organization.id,
                      "user_id" => owner.id,
                      "role" => "admin"}

      role = OrganizationMember.create_changeset %OrganizationMember{}, role_params

      Repo.insert! role

      organization
    end
  end

  def handle_update(conn, organization, attributes) do
    authorize! conn, organization

    Organization.update_changeset organization, attributes
  end

  def handle_delete(conn, organization) do
    authorize! conn, organization

    super conn, organization
  end

  # Filters

  filterable_by ["id", "name", "private"]
end
