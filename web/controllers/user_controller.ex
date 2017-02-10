defmodule Poker.UserController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.User

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

  # Filters

  filterable_by ["id", "username"]
end
