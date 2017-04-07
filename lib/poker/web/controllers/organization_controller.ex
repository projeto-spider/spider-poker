defmodule Poker.Web.OrganizationController do
  use Poker.Web, :controller

  alias Poker.{Organization, OrganizationMember}

  def index(conn, params) do
    page =
      scope(conn)
      |> paginate(params)

    render(conn, "index.json", page: page)
  end

  def create(conn, %{"data" => params}) do
    changeset = Organization.create_changeset(params)

    with :ok            <- authorize(conn, :create),
         {:ok, org}     <- Repo.insert(changeset),
         owner          <- conn.assings[:current_user],
         role           <- %{"organization_id" => org.id,
                             "user_id" => owner.id,
                             "role" => "admin"},
         role_changeset <- OrganizationMember.create_changeset(role),
         {:ok, _role}   <- Repo.insert(role)
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", organization_path(conn, :show, org))
      |> render("show.json", data: org)
    end
  end

  def show(conn, %{"id" => id}) do
    with org <- Repo.get!(scope(conn), id),
         :ok <- authorize(conn, :show, %{organization: org})
    do
      render(conn, "show.json", data: org)
    end
  end

  def update(conn, %{"id" => id, "data" => params}) do
    with org        <- Repo.get!(scope(conn), id),
         :ok        <- authorize(conn, :update, %{organization: org}),
         changeset  <- Organization.update_changeset(org, params),
         {:ok, org} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: org)
    end
  end

  def delete(conn, %{"id" => id}) do
    with org      <- Repo.get!(scope(conn), id),
         :ok      <- authorize(conn, :delete, %{organization: org}),
         {:ok, _} <- Repo.delete(org)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
