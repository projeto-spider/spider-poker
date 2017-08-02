defmodule App.Web.ProjectMemberController do
  use App.Web, :controller

  alias App.Web.Session
  alias App.Web.Notify
  alias App.Accounts
  alias App.Accounts.User
  alias App.Projects
  alias App.Projects.Member

  def index(conn, %{"project_id" => project_id}) do
    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- member?(project_id, current_user) do
      members = Projects.list_users(project_id)
      render(conn, "index.json", members: members)
    end
  end

  def create(conn, %{"project_id" => project_id, "data" => %{"user_id" => user_id}}) do
    project = Projects.get_project!(project_id)
    user = Accounts.get_user!(user_id)

    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- manager?(project_id, current_user),
         {:ok, %Member{}} <- Projects.add_member(project_id, user_id) do
      Notify.join_project(project, user.id)

      conn
      |> put_status(:created)
      |> render("show.json", member: user)
    else
      {:error, :already_member} ->
        {:error, :"400"}
    end
  end

  def delete(conn, %{"project_id" => project_id, "id" => id}) do
    member = Projects.get_member!(project_id, id)
    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- manager_or_self?(project_id, member, current_user),
         {:ok, %Member{}} <- Projects.remove_member(member) do
      if id != current_user.id do
        Notify.left_project(project_id, id)
      end
      send_resp(conn, :no_content, "")
    end
  end

  defp member?(project_id, %User{id: user_id}) do
    if Projects.member?(project_id, user_id) do
      :ok
    else
      {:error, :not_found}
    end
  end

  defp manager?(project_id, %User{id: user_id}) do
    if Projects.manager?(project_id, user_id) do
      :ok
    else
      {:error, :"401"}
    end
  end

  defp manager_or_self?(project_id, %Member{user_id: user_id}, %User{id: current_id} = current_user) do
    if user_id == current_id do
      :ok
    else
      manager?(project_id, current_user)
    end
  end
end
