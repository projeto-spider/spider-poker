defmodule Poker.Web.Policy.OrganizationMember do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, OrganizationMember}
  alias Poker.Accounts.User

  def can?(nil, action, _resource)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}=user, action, %{organization_id: org_id,
                                              user_id: new_member_id})
  when action in [:create] do
    if OrganizationMember.admin?(org_id, user_id) do
      if not OrganizationMember.member?(org_id, new_member_id) do
        true
      else
        {:error, {:bad_request, "user already is a member"}}
      end
    else
      false
    end
  end

  def can?(%User{id: user_id}, action, %{organization_id: org_id})
  when action in [:update, :delete] do
    OrganizationMember.admin?(org_id, user_id)
  end

  def can?(_user, _action, _resource), do: false
end
