defmodule Poker.OrganizationController do
  use Poker.Web, :controller

  alias Poker.{Organization, OrganizationMember}

  # Scope

  def records(conn) do
    scope(conn, Organization)
    |> filter_params(conn, ["name", "private"])
    |> search_params(conn, ["name"])
  end

  # Actions

  def index(conn, _params) do
    organizations =
      records(conn)
      |> Repo.all

    render(conn, "index.json", data: organizations)
  end

  def create(conn, %{"data" => params}) do
    changeset = Organization.create_changeset %Organization{}, params

    authorize! conn, Organization

    case Repo.insert(changeset) do
      {:ok, organization} ->
        owner = conn.assigns.current_user

        role_params = %{"organization_id" => organization.id,
                        "user_id" => owner.id,
                        "role" => "admin"}

        role = OrganizationMember.create_changeset %OrganizationMember{}, role_params

        Repo.insert! role

        conn
        |> put_status(:created)
        |> put_resp_header("location", organization_path(conn, :show, organization))
        |> render("show.json", data: organization)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    organization =
      records(conn)
      |> Repo.get!(id)

    render(conn, "show.json", data: organization)
  end

  def update(conn, %{"id" => id, "data" => params}) do
    organization =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, organization

    changeset = Organization.update_changeset(organization, params)

    case Repo.update(changeset) do
      {:ok, organization} ->
        render(conn, "show.json", data: organization)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    organization =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, organization

    Repo.delete!(organization)

    send_resp(conn, :no_content, "")
  end
end
