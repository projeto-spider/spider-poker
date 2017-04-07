defmodule Poker.Web.ProjectMemberController do
  use Poker.Web, :controller

  alias Poker.{ProjectMember, User}

  alias Poker.Web.Scope.Project, as: ProjectScope
  alias Poker.Web.Scope.User, as: UserScope

  def project(%{params: %{"project_id" => proj_id}} = conn) do
    try do
      scoped = scope(conn, %{action: :show, scope: ProjectScope})
      {:ok, Repo.get!(scoped, proj_id)}
    rescue
      err in Ecto.NoResultsError ->
        {:error, {:bad_request, "project does not exists"}}
    end
  end

  def user(conn, user_id) do
    try do
      scoped = scope(conn, %{action: :show, scope: UserScope, unnest?: true})
      {:ok, Repo.get!(scoped, user_id)}
    rescue
      err in Ecto.NoResultsError ->
        {:error, {:bad_request, "user does not exists"}}
    end
  end

  def membership(%{params: %{"id" => user_id}} = conn) do
    scoped = scope(conn)
    Repo.get_by!(scoped, user_id: user_id)
  end

  def record(conn, user_id) do
    scope(conn)
    |> Repo.get_by(user_id: user_id)
  end

  def index(conn, params) do
    with {:ok, proj} <- project(conn) do
      page =
        scope(conn)
        |> paginate(params)

      render(conn, "index.json", page: page)
    end
  end

  def create(conn, %{"data" => %{"user_id" => user_id} = params}) do
    role = Map.get(params, "role", "team")
    params =
      %{user_id: user_id, role: role}

    with {:ok, proj}       <- project(conn),
         {:ok, user}       <- user(conn, user_id),
         params            <- Map.put(params, :project_id, proj.id),
         params            <- Map.put(params, :user, user),
         :ok               <- authorize(conn, :create, params),
         changeset         <- ProjectMember.create_changeset(params),
         {:ok, membership} <- Repo.insert(changeset)
    do
      conn
      |> put_status(:created)
      |> render("show.json", data: %{membership | user: user})
    end
  end

  def show(conn, %{"id" => user_id}) do
    with membership <- membership(conn)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def update(conn, %{"id" => user_id, "data" => params}) do
    with membership        <- membership(conn),
         :ok               <- authorize(conn, :update, %{project_id: membership.project_id}),
         changeset         <- ProjectMember.update_changeset(membership, params),
         {:ok, membership} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def delete(conn, %{"id" => user_id}) do
    with membership <- membership(conn),
         :ok        <- authorize(conn, :delete, %{project_id: membership.project_id}),
         {:ok, _} <- Repo.delete(membership)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
