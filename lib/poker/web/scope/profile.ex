defmodule Poker.Web.Scope.Profile do
  use Poker.Web, :scope

  alias Poker.Profile

  def default(%{params: %{"user_id" => user_id}} = conn) do
    Profile
    |> where(user_id: ^user_id)
  end

  def scope(conn, _user, _action, _data) do
    default(conn)
  end
end
