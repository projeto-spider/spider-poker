defmodule Poker.ProjectController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{Project, Organization}

  plug :ensure_authenticated when action in [:create, :update, :delete]
  plug :preload_session
  plug JaResource

  # Scope

  def records(conn) do
    scope conn, Project
  end

  # Handlers

  def handle_create(conn, attributes) do
    authorize! conn, %Project{organization_id: attributes["organization_id"]}

    organization = Repo.get! Organization, attributes["organization_id"]

    attributes = attributes
                 |> Map.put("organization", organization)

    Project.create_changeset %Project{}, attributes
  end

  def handle_update(conn, project, attributes) do
    authorize! conn, project

    Project.update_changeset project, attributes
  end

  def handle_delete(conn, project) do
    authorize! conn, project

    super conn, project
  end

  # Filters

  filterable_by ["id", "name", "private"]
end
