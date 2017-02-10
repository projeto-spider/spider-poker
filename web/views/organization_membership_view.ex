defmodule Poker.OrganizationMembershipView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView

  location "/organizations/:organization_id/relationships/memberships/:id"

  attributes [:role]

  has_one :user,
    serializer: Poker.UserView,
    include: true,
    links: [
      self: "/users/:user_id"
    ]

  def organization_id(%{organization_id: id}, _conn) do
    id
  end

  def user_id(%{user_id: id}, _conn) do
    id
  end
end
