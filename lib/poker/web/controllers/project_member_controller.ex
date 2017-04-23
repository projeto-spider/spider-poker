defmodule Poker.Web.ProjectMemberController do
  @moduledoc false
  use Poker.Web, :controller

  alias Poker.Accounts
  alias Poker.Projects

  def index(conn, ~m{project_id} = params) do
    user_id = Session.user_id!(conn)

    with :ok <- Projects.can_see?(project_id, user_id) do
      page =
        conn
        |> scope
        |> Repo.paginate(params)

      render(conn, "index.json", page: page)
    end
  end

  def create(conn, ~m{data} = params) do
    with {:ok, proj_id}      <- Param.fetch(params, "project_id"),
         {:ok, user_id}      <- Param.fetch(data, "user_id"),
         role                <- Map.get(data, "role", "team"),
         {:ok, session_user} <- Session.user(conn),
         true                <- Projects.manager?(proj_id, session_user.id),
         {:ok, user}         <- Accounts.get(user_id),
         {:ok, membership}   <- Projects.add_member(proj_id, user_id, role)
    do
      conn
      |> put_status(:created)
      |> render("show.json", data: %{membership | user: user})
    end
  end

  def show(conn, ~m{project_id, id}) do
    user_id = Session.user_id!(conn)
    with :ok               <- Projects.can_see?(project_id, user_id),
         {:ok, membership} <- Projects.get_member(project_id, id)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def update(conn, ~m{project_id, id, data}) do
    with {:ok, session_user} <- Session.user(conn),
         true                <- Projects.manager?(project_id, session_user.id),
         {:ok, _user}        <- Accounts.get(id),
         {:ok, membership}   <- Projects.get_member(project_id, id),
         {:ok, membership}   <- Projects.update_member(membership, data)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def delete(conn, ~m{project_id, id}) do
    with {:ok, session_user} <- Session.user(conn),
         true                <- Projects.manager?(project_id, session_user.id),
         {:ok, _membership}  <- Projects.delete_member(project_id, id)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
