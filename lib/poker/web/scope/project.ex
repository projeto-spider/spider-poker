defmodule Poker.Web.Scope.Project do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.Pattern
  alias Poker.Projects

  @filters   ["name", "private", "organization_id"]
  @searchers ["name", "display_name", "description"]

  def filters(query, conn) do
    query
    |> preload([:organization])
    |> filter_params(conn, @filters)
    |> search_params(conn, @searchers)
  end

  def nested(query, conn) do
    case nested_resource(conn) do
      {"organizations", org_id} ->
        if Pattern.numeric?(org_id) do
          query
          |> where(organization_id: ^org_id)
        else
          from p in query,
          join: o in assoc(p, :organization),
          where: o.name == ^org_id
        end

      {"users", user_id} ->
        if Pattern.numeric?(user_id) do
          from o in query,
          join: m in assoc(o, :projects_members),
          where: m.user_id == ^user_id
        else
          from o in query,
          join: m in assoc(o, :projects_members),
          join: u in assoc(m, :user),
          where: u.username == ^user_id
        end

      _ ->
        query
    end
  end

  def scope(conn, user, _action, _data) do
    user
    |> Projects.query_visible_to
    |> nested(conn)
    |> filters(conn)
  end
end
