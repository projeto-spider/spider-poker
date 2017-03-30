defmodule Poker.Web.Scope.User do
  use Poker.Web, :scope

  alias Poker.User

  @filters   ["username"]
  @searchers ["username"]

  def default(conn, data \\ %{}) do
    base =
      User
      |> preload([:profile])
      |> filter_params(conn, @filters)
      |> search_params(conn, @searchers)

    unnest? = Map.get(data, :unnest?, false)

    if unnest? do
      base
    else
      case nested_resource(conn) do
        {"organizations", id} ->
          from u in base,
            join: o in assoc(u, :organizations_users),
            where: o.organization_id == ^id

        _ ->
          base
      end
    end
  end

  def scope(conn, _user, _action, data \\ %{}) do
    default(conn, data)
  end
end
