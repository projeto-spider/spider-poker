defmodule Poker.Web.Scope.OrganizationMember do
  use Poker.Web, :scope

  alias Poker.{User, OrganizationMember}

  def default(%{params: %{"organization_id" => org_id}} = conn) do
    OrganizationMember
    |> preload([user: :profile])
    |> where(organization_id: ^org_id)
  end

  def scope(conn, _user, _action, _data) do
    default(conn)
  end
end
