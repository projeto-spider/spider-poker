defmodule Poker.OrganizationMember.Policy do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, User, OrganizationMember}

  def can?(nil, action, _resource)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}=user, action, %{organization_id: org_id,
                                              user_id: new_member_id})
  when action in [:create] do
    if OrganizationMember.admin?(org_id, user_id) do
      if not OrganizationMember.member?(org_id, new_member_id) do
        true
      else
        {:error, :bad_request}
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

  def scope(nil, _action, _query) do
    OrganizationMember
    |> OrganizationMember.where_is_public
  end

  def scope(%User{id: user_id}, _action, _query) do
    OrganizationMember
    |> OrganizationMember.where_user_can_see(user_id)
    |> preload([user: :profile])
  end
end
