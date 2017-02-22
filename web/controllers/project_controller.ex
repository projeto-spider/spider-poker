defmodule Poker.ProjectController do
  use Poker.Web, :controller

  alias Poker.{Repo, Project, ProjectMember, Organization}

  # Scope

  def records(conn) do
    default = scope conn, Project

    case nested_resource(conn) do
      {"organizations", org_id} ->
        default
        |> where(organization_id: ^org_id)

      _ ->
        default
    end
    |> filter_params(conn, ["name", "private", "organization_id"])
    |> search_params(conn, ["name", "display_name", "description"])
    |> distinct(true)
  end

  # Handlers

  def index(conn, _params) do
    projects =
      records(conn)
      |> Repo.all

    render(conn, "index.json", data: projects)
  end

  def create(conn, %{"data" => params}) do
    org_id =
      case nested_resource(conn) do
        {"organizations", org_id} ->
          org_id
        _ ->
          Map.get(params, "organization_id")
      end

    authorize! conn, %Project{organization_id: org_id}

    organization = Repo.get!(Organization, org_id)

    params = Map.put(params, "organization", organization)

    changeset = Project.create_changeset %Project{}, params

    case Repo.insert(changeset) do
      {:ok, project} ->
        member = conn.assigns.current_user

        role_params = %{"project_id" => project.id,
                        "user_id" => member.id,
                        "role" => "manager"}

        role = ProjectMember.create_changeset %ProjectMember{}, role_params

        Repo.insert! role

        conn
        |> put_status(:created)
        |> put_resp_header("location", project_path(conn, :show, project))
        |> render("show.json", data: project)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    project =
      records(conn)
      |> Repo.get!(id)

    render(conn, "show.json", data: project)
  end

  def update(conn, %{"id" => id, "data" => params}) do
    project =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, project

    changeset = Project.update_changeset(project, params)

    case Repo.update(changeset) do
      {:ok, project} ->
        render(conn, "show.json", data: project)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    project =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, project

    Repo.delete!(project)

    send_resp(conn, :no_content, "")
  end
end
