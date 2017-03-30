defmodule Poker.Web.OrganizationMemberController do
  use Poker.Web, :controller

  alias Poker.{User, OrganizationMember, UserView}
  alias Poker.Web.Scope.Organization, as: OrganizationScope
  alias Poker.Web.Scope.User, as: UserScope

  def organization(%{params: %{"organization_id" => org_id}} = conn) do
    try do
      scoped = scope(conn, %{action: :show, scope: OrganizationScope})
      {:ok, Repo.get!(scoped, org_id)}
    rescue
      err in Ecto.NoResultsError ->
        {:error, {:bad_request, "organization does not exists"}}
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

  def index(conn, %{"organization_id" => org_id}) do
    with {:ok, org} <- organization(conn) do
      members =
        scope(conn)
        |> Repo.all

      render(conn, "index.json", data: members)
    end
  end

  def create(conn, %{"data" => %{"user_id" => user_id} = params}) do
    role = Map.get(params, "role", "member")
    params =
      %{user_id: user_id, role: role}

    with {:ok, org}        <- organization(conn),
         {:ok, user}       <- user(conn, user_id),
         params            <- Map.put(params, :organization_id, org.id),
         params            <- Map.put(params, :user, user),
         :ok               <- authorize(conn, :create, params),
         changeset         <- OrganizationMember.create_changeset(params),
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

  def update(conn, %{"organization_id" => org_id, "data" => params}) do
    with membership        <- membership(conn),
         :ok               <- authorize(conn, :update, %{organization_id: org_id}),
         changeset         <- OrganizationMember.update_changeset(membership, params),
         {:ok, membership} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def delete(conn, %{"id" => user_id}) do
    with membership <- membership(conn),
         :ok        <- authorize(conn, :delete, %{organization_id: membership.organization_id}),
         {:ok, _} <- Repo.delete(membership)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
