defmodule App.Web.Admin.ProjectMemberController do
  use App.Web, :controller

  alias App.Web.Notify
  alias App.Accounts
  alias App.Projects
  alias App.Projects.Member
  alias App.Web.ProjectMemberView

  def index(conn, %{"project_id" => project_id}) do
    members = Projects.list_users(project_id)
    render(conn, ProjectMemberView, "index.json", members: members)
  end

  def create(conn, %{"project_id" => project_id, "data" => %{"user_id" => user_id}}) do
    project = Projects.get_project!(project_id)
    user = Accounts.get_user!(user_id)

    with {:ok, %Member{}} <- Projects.add_member(project_id, user_id) do
      Notify.join_project(project, user.id)

      conn
      |> put_status(:created)
      |> render(ProjectMemberView, "show.json", member: user)
    else
      {:error, :already_member} ->
        {:error, :"400"}
    end
  end

  def delete(conn, %{"project_id" => project_id, "id" => id}) do
    member = Projects.get_member!(project_id, id)
    with {:ok, %Member{}} <- Projects.remove_member(member) do
      Notify.left_project(project_id, id)
      send_resp(conn, :no_content, "")
    end
  end
end
