defmodule App.Web.ProjectController do
  use App.Web, :controller

  alias App.Accounts.User
  alias App.Projects
  alias App.Projects.Project
  alias App.Web.Session
  alias App.Web.Notify

  def index(conn, _params) do
    with {:ok, current_user} <- Session.current_user(conn) do
      projects = Projects.list_user_projects(current_user.id)
      render(conn, "index.json", projects: projects)
    end
  end

  def create(conn, %{"data" => project_params}) do
    with {:ok, user} <- Session.current_user(conn),
         {:ok, %Project{} = project} <-
           Projects.create_project(project_params, user) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", project_path(conn, :show, project))
      |> render("show.json", project: project)
    end
  end

  def show(conn, %{"id" => id}) do
    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- member?(id, current_user) do
      project = Projects.get_project!(id)
      render(conn, "show.json", project: project)
    end
  end

  def update(conn, %{"id" => id, "data" => project_params}) do
    project = Projects.get_project!(id)

    with {:ok, user} <- Session.current_user(conn),
         :ok <- manager?(project, user),
         {:ok, %Project{} = project} <-
           Projects.update_project(project, project_params) do
      Notify.project_updated(project, user)
      render(conn, "show.json", project: project)
    end
  end

  def delete(conn, %{"id" => id}) do
    project = Projects.get_project!(id)

    with {:ok, user} <- Session.current_user(conn),
         :ok <- manager?(project, user),
         _ = Notify.project_deleted(project, user),
         {:ok, %Project{}} <- Projects.delete_project(project) do
      send_resp(conn, :no_content, "")
    end
  end

  def backlog(conn, %{"project_id" => project_id}) do
    project = Projects.get_project!(project_id)

    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- member?(project, current_user) do
      backlog = Projects.backlog(project)
      render(conn, App.Web.StoryView, "index.json", backlog: backlog)
    end
  end

  defp member?(project_id, %User{id: user_id}) do
    if Projects.member?(project_id, user_id) do
      :ok
    else
      {:error, :not_found}
    end
  end

  defp manager?(%Project{manager_id: manager_id}, %User{id: user_id})
  when manager_id == user_id, do: :ok
  defp manager?(_project, _user), do: {:error, :"401"}
end
