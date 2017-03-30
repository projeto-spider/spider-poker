defmodule Poker.Web.Scope.Organization do
  use Poker.Web, :scope

  alias Poker.{User, Organization}

  @filters   ["name", "private"]
  @searchers ["name"]

  def default(conn) do
    Organization
    |> filter_params(conn, @filters)
    |> search_params(conn, @searchers)
  end

  def scope(conn, %User{id: user_id}, action, _data)
  when action in [:update, :delete] do
    default(conn)
    |> Organization.where_user_is_admin(user_id)
  end

  def scope(conn, %User{id: user_id}, action, _data)
  when action in [:index, :show] do
    default(conn)
    |> Organization.where_user_can_see(user_id)
  end

  def scope(conn, nil, _action, _data) do
    default(conn)
    |> where(private: false)
  end
end
