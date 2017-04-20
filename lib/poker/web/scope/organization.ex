defmodule Poker.Web.Scope.Organization do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.Organizations

  @filters   ["name", "display_name", "private"]
  @searchers ["name", "display_name"]

  def filters(query, conn) do
    query
    |> filter_params(conn, @filters)
    |> search_params(conn, @searchers)
  end

  def scope(conn, user, _action, _data) do
    user
    |> Organizations.query_visible_to
    |> filters(conn)
  end
end
