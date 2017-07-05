defmodule Poker.Web.ProjectController do
  use Poker.Web, :controller

  alias Poker.Repo
  alias Poker.Projects
  alias Poker.Projects.Project
  alias Poker.Organizations

  def index(conn, params) do
    get_page = fn ->
      conn
      |> scope
      |> Repo.paginate(params)
    end

    case nested_resource(conn) do
      {"organizations", organization_id} ->
        user_id = Session.user_id!(conn)

        with :ok <- Organizations.can_see?(organization_id, user_id) do
          render(conn, "index.json", page: get_page.())
        end

      _ ->
          render(conn, "index.json", page: get_page.())
    end
  end

  def create(conn, params) do
    # You can either POST at /organizations/1/projects which would make `params`
    # have a "organization_id" key or POST at /projects with a
    # "organization_id" key.
    fetch_org_id =
      with {:error, _} <- Param.fetch(params, "organization_id") do
        Param.fetch(params["data"], "organization_id")
      end

    with {:ok, org_id} <- fetch_org_id,
         {:ok, user}   <- Session.user(conn),
         :ok           <- authorize(conn, :create, %{organization_id: org_id}),
         {:ok, data}   <- Param.fetch(params, "data"),
         attrs         <- Map.put_new(data, "organization_id", org_id),
         {:ok, proj}   <- Projects.create(attrs),
         {:ok, _role}  <- Projects.add_member(proj.id, user.id, "manager", notify?: false)
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", project_path(conn, :show, proj))
      |> render("show.json", data: proj)
    end
  end

  def show(conn, ~m{id}) do
    with {:ok, proj} <- Projects.get(scope(conn), id) do
      render(conn, "show.json", data: proj)
    end
  end

  def update(conn, ~m{id, data}) do
    with {:ok, proj} <- Projects.get(scope(conn), id),
         :ok         <- authorize(conn, :update, %{project_id: proj.id}),
         {:ok, proj} <- Projects.update(proj, data)
    do
      render(conn, "show.json", data: proj)
    end
  end

  def delete(conn, ~m{id}) do
    with {:ok, proj} <- Projects.get(scope(conn), id),
         :ok         <- authorize(conn, :delete, %{project_id: proj.id}),
         {:ok, _}    <- Projects.delete(proj)
    do
      send_resp(conn, :no_content, "")
    end
  end

  def backlog(conn, ~m{id}) do
    with {:ok, %Project{backlog: order}} <- Projects.get(id) do
      stories =
        Projects.query_stories(id)
        |> Repo.all

      render(conn, "backlog.json", order: order, stories: stories)
    end
  end
end
