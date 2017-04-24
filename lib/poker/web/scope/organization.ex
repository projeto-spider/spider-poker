defmodule Poker.Web.Scope.Organization do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.Pattern
  alias Poker.Organizations

  @filters   ["name", "display_name", "private"]
  @searchers ["name", "display_name"]

  def filters(query, conn) do
    query
    |> filter_params(conn, @filters)
    |> search_params(conn, @searchers)
  end

  def nested(query, conn) do
    case nested_resource(conn) do
      {"users", user_id} ->
        if Pattern.numeric?(user_id) do
          from o in query,
          join: m in assoc(o, :organizations_members),
          where: m.user_id == ^user_id
        else
          from o in query,
          join: m in assoc(o, :organizations_members),
          join: u in assoc(m, :user),
          where: u.username == ^user_id
        end

      _ ->
        query
    end
  end

  def scope(conn, user, _action, _data) do
    user
    |> Organizations.query_visible_to
    |> nested(conn)
    |> filters(conn)
  end
end
