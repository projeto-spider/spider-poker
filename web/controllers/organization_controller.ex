defmodule Poker.OrganizationController do
  use Poker.Web, :controller

  alias Poker.{Organization, OrganizationUser}

  plug EnsureAuthenticated when action in [:create, :update, :delete]
  plug :prefetch_organization when action in [:show, :update, :delete]
  plug :can_see_organization when action in [:show]
  plug :can_modify_organization when action in [:update, :delete]

  def index(conn, _params) do
    organizations = Repo.all(Organization)
    render(conn, "index.json", organizations: organizations)
  end

  def create(conn, %{"organization" => organization_params}) do
    changeset = Organization.registration_changeset(%Organization{}, organization_params)

    case Repo.insert(changeset) do
      {:ok, organization} ->
        logged_in = current_resource(conn)
        role_params = %{"organization_id" => organization.id,
                        "user_id" => logged_in.id, "role" => "owner"}
        role = OrganizationUser.registration_changeset(%OrganizationUser{}, role_params)

        Repo.insert! role

        conn
        |> put_status(:created)
        |> put_resp_header("location", organization_path(conn, :show, organization))
        |> render("show.json", organization: organization)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, _params) do
    organization = conn.assigns.organization
    render(conn, "show.json", organization: organization)
  end

  def update(conn, %{"organization" => organization_params}) do
    organization = conn.assigns.organization
    changeset = Organization.update_changeset(organization, organization_params)

    case Repo.update(changeset) do
      {:ok, organization} ->
        render(conn, "show.json", organization: organization)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, _params) do
    organization = conn.assigns.organization

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(organization)

    send_resp(conn, :no_content, "")
  end

  # Helpers

  defp prefetch_organization(%{params: %{"id" => name}} = conn, _opts) do
    case Repo.get_by(Organization, name: name) do
      nil ->
        conn
        |> send_resp(:not_found, "Organization doesn't exist")
      organization ->
        conn
        |> assign(:organization, organization)
      end
  end

  defp can_see_organization(%{params: %{"id" => name}} = conn, _opts) do
    organization = conn.assigns.organization

    if not organization.private do
      conn
    else
      case current_resource(conn) do
        nil ->
          conn
          |> send_resp(:unauthorized, "Cannot see this organization")
        logged_in ->
          query = from it in OrganizationUser,
                  where: it.user_id == ^logged_in.id,
                  where: it.organization_id == ^organization.id

          case Repo.one(query) do
            nil ->
              conn
              |> send_resp(:unauthorized, "Cannot see this organization")
            _ ->
              conn
          end
      end
    end
  end

  defp can_modify_organization(%{params: %{"id" => name}} = conn, _opts) do
    logged_in = current_resource(conn)
    organization = conn.assigns.organization

    query = from it in OrganizationUser,
            where: it.user_id == ^logged_in.id,
            where: it.organization_id == ^organization.id,
            where: it.role == "owner"

    case Repo.one(query) do
      nil ->
        conn
        |> send_resp(:unauthorized, "Cannot modify this organization.")
      _ ->
        conn
    end
  end
end
