defmodule Poker.Web.ProjectMemberController do
  use Poker.Web, :controller

  alias Poker.{ProjectMember, User}

  # Scope

  def records(%{params: %{"project_id" => proj_id}} = conn) do
    scope(conn, ProjectMember)
    |> where(project_id: ^proj_id)
    |> preload([user: :profile])
    |> distinct(true)
  end

  def record(conn, user_id) do
    records(conn)
    |> Repo.get_by(user_id: user_id)
  end

  def index(conn, _params) do
    members =
      records(conn)
      |> Repo.all

    render(conn, "index.json", data: members)
  end

  def create(conn, %{"project_id" => proj_id, "data" => %{"user_id" => user_id} = params}) do
    params =
      params
      |> Map.put("project_id", proj_id)
      |> Map.put_new("role", "team")

    to_validate = %ProjectMember{project_id: proj_id, user_id: user_id}

    authorize! conn, to_validate

    changeset = ProjectMember.create_changeset(%ProjectMember{}, params)

    case Repo.insert(changeset) do
      {:ok, membership} ->
        user =
          User
          |> preload([:profile])
          |> Repo.get!(user_id)

        conn
        |> put_status(:created)
        |> render("show.json", data: %{membership | user: user})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => user_id}) do
    membership = record(conn, user_id)
    render(conn, "show.json", data: membership)
  end

  def update(conn, %{"id" => user_id, "data" => params}) do
    membership = record(conn, user_id)

    authorize! conn, membership

    changeset = ProjectMember.update_changeset(membership, params)

    case Repo.update(changeset) do
      {:ok, membership} ->
        render(conn, "show.json", data: membership)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => user_id}) do
    membership = record(conn, user_id)

    authorize! conn, membership

    Repo.delete!(membership)

    send_resp(conn, :no_content, "")
  end
end
