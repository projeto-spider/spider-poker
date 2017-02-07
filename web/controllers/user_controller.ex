defmodule Poker.UserController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{User, OrganizationUser, UserView}

  plug :preload_session when action in [:update, :delete, :add_to_organization,
                                        :remove_from_organization]
  plug JaResource

  # Scope

  def records(conn) do
    default = scope conn, User

    case nested_resource(conn) do
      {"organizations", id} ->
        from u in default,
          join: o in assoc(u, :organizations_users),
          where: o.organization_id == ^id

      _ ->
        default
    end
  end

  # Handlers

  def handle_create(_conn, attributes) do
    User.create_changeset %User{}, attributes
  end

  def handle_update(conn, user, attributes) do
    authorize! conn, user

    User.update_changeset user, attributes
  end

  def handle_delete(conn, user) do
    authorize! conn, user

    super conn, user
  end

  # Organization relationship

  def add_to_organization(conn, %{
    "data" => %{
      "attributes" => %{
        "user_id" => user_id
      }
    }
  }) do
    with {"organizations", org_id} <- nested_resource(conn) do
      attributes = %{
        organization_id: org_id,
        user_id: user_id,
        role: "member"
      }

      to_validate = Map.merge %OrganizationUser{}, attributes
      authorize! conn, to_validate, action: :create

      changeset = OrganizationUser.create_changeset %OrganizationUser{}, attributes

      Repo.insert! changeset

      user = User
             |> preload(:profile)
             |> Repo.get!(user_id)

      render conn, UserView, "show.json-api", data: user
    end
  end

  def remove_from_organization(conn, %{"user_id" => user_id, "organization_id" => org_id}) do
    with {"organizations", org_id} <- nested_resource(conn) do
      membership = OrganizationUser
                   |> Repo.get_by(user_id: user_id, organization_id: org_id)

      authorize! conn, membership, action: :delete

      Repo.delete! membership

      send_resp conn, 200, ""
    end
  end

  # Filters

  filterable_by ["id", "username"]
end
