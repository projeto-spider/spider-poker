defmodule Poker.Web.ProjectController do
  use Poker.Web, :controller

  alias Poker.{Repo, Project, ProjectMember, Organization}

  plug :flatten_param, "data" when action == :create

  def index(conn, _params) do
    projects =
      scope(conn)
      |> Repo.all

    render(conn, "index.json", data: projects)
  end

  def create(conn, params) do
    fetch_org_id =
      case nested_resource(conn) do
        {"organizations", org_id} ->
          {:ok, org_id}
        _ ->
          with :error <- Map.fetch(params, "organization_id") do
            {:error, :bad_request}
          end
      end

    with {:ok, org_id} <- fetch_org_id,
         organization  <- Repo.get!(Organization, org_id),
         params        <- params
                          |> Map.put("organization_id", org_id)
                          |> Map.put("organization", organization),
         changeset     <- Project.create_changeset(params),
         :ok           <- authorize(conn, :create, %{organization_id: org_id}),
         {:ok, proj}   <- Repo.insert(changeset),
         user          <- conn.assigns[:current_user],
         role          <- %{"project_id" => proj.id,
                            "user_id" => user.id,
                            "role" => "manager"},
         role          <- ProjectMember.create_changeset(role),
         {:ok, _role}  <- Repo.insert(role)
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", project_path(conn, :show, proj))
      |> render("show.json", data: proj)
    end
  end

  def show(conn, %{"id" => id}) do
    with proj <- Repo.get!(scope(conn), id),
         :ok  <- authorize(conn, :show, %{project: proj})
    do
      render(conn, "show.json", data: proj)
    end
  end

  def update(conn, %{"id" => id, "data" => params}) do
    with proj        <- Repo.get!(scope(conn), id),
         :ok         <- authorize(conn, :update, %{project_id: proj.id}),
         changeset   <- Project.update_changeset(proj, params),
         {:ok, proj} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: proj)
    end
  end

  def delete(conn, %{"id" => id}) do
    with proj     <- Repo.get!(scope(conn), id),
         :ok      <- authorize(conn, :delete, %{project_id: proj.id}),
         {:ok, _} <- Repo.delete(proj)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
