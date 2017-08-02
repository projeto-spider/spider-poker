defmodule App.Web.Admin.ProjectController do
  use App.Web, :controller

  alias App.Repo
  alias App.Projects
  alias App.Projects.Project
  alias App.Web.Session
  alias App.Web.Notify
  alias App.Web.ProjectView

  def index(conn, params) do
    page =
      Project
      |> Repo.paginate(params)

    conn
    |> Scrivener.Headers.paginate(page)
    |> render(ProjectView, "index.json", projects: page)
  end

  def show(conn, %{"id" => id}) do
    project = Projects.get_project!(id)
    render(conn, ProjectView, "show.json", project: project)
  end

  def update(conn, %{"id" => id, "data" => project_params}) do
    project = Projects.get_project!(id)

    with {:ok, user} <- Session.current_user(conn),
         {:ok, %Project{} = project} <- Projects.update_project(project, project_params) do
      Notify.project_updated(project, user)
      render(conn, ProjectView, "show.json", project: project)
    end
  end

  def delete(conn, %{"id" => id}) do
    project = Projects.get_project!(id)

    with {:ok, user} <- Session.current_user(conn),
         _ = Notify.project_deleted(project, user),
         {:ok, %Project{}} <- Projects.delete_project(project) do
      send_resp(conn, :no_content, "")
    end
  end
end
