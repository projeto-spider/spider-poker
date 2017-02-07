defmodule Poker.OrganizationController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{User, Organization, OrganizationUser}

  plug :ensure_authenticated when action in [:create, :update, :delete]
  plug :preload_session
  plug JaResource

  # Scope

  def records(conn) do
    scope conn, Organization
  end

  # Handlers

  def handle_create(conn, attributes) do
    changeset = Organization.create_changeset %Organization{}, attributes

    with {:ok, organization} <- Repo.insert(changeset) do
      owner = conn.assigns.current_user

      role_params = %{"organization_id" => organization.id,
                      "user_id" => owner.id,
                      "role" => "owner"}

      role = OrganizationUser.create_changeset %OrganizationUser{}, role_params

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
