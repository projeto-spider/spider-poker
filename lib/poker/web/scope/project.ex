defmodule Poker.Web.Scope.Project do
  use Poker.Web, :scope

  alias Poker.{User, Project}

  @filters   ["name", "private", "organization_id"]
  @searchers ["name", "display_name", "description"]

  def default(conn) do
    base =
      Project
      |> preload([:organization])
      |> filter_params(conn, @filters)
      |> search_params(conn, @searchers)
      |> distinct(true)

    case nested_resource(conn) do
      {"organizations", org_id} ->
        base
        |> where(organization_id: ^org_id)

      _ ->
        base
    end
  end

  def scope(conn, %User{id: user_id}, _action, _data) do
    default(conn)
    |> Project.where_user_can_see(user_id)
  end

  def scope(conn, nil, _action, _data) do
    default(conn)
    |> Project.where_is_public
  end
end
