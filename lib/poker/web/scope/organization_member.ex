defmodule Poker.Web.Scope.OrganizationMember do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.Organizations

  def scope(%{params: ~m{organization_id}}, _user, _action, _data) do
    Organizations.query_members(organization_id)
  end
end
