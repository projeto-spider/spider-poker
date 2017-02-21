defmodule Poker.Organization.Policy do
  import Ecto.Query, only: [from: 2, where: 2]
  alias Poker.{Repo, User, Organization, OrganizationMember}

  def can?(nil, action, resource)
  when action == :create, do: false

  def can?(%User{id: user_id}, action, %{id: org_id})
  when action in [:update, :delete] do
    OrganizationMember.admin?(org_id, user_id)
  end

  def can?(_user, _action, _resource), do: true

  def scope(%User{id: user_id}, action, _org)
  when action in [:update, :delete] do
    Organization
    |> Organization.where_user_is_admin(user_id)
  end

  def scope(%User{id: user_id}, _action, _org) do
    Organization
    |> Organization.where_user_can_see(user_id)
  end

  def scope(nil, _action, _org) do
    Organization
    |> where(private: false)
  end
end
