defmodule Poker.Web.Policy.Organization do
  use Poker.Web, :policy

  alias Poker.{User, OrganizationMember}

  def can?(nil, action, _data)
  when action == :create, do: false

  def can?(%User{id: user_id}, action, %{organization: %{id: org_id}})
  when action in [:update, :delete] do
    OrganizationMember.admin?(org_id, user_id)
  end

  def can?(_user, _action, _data), do: true
end
