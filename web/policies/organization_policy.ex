defmodule Poker.Organization.Policy do
  import Ecto.Query, only: [from: 2, where: 2]
  alias Poker.{Repo, User, Organization, OrganizationUser}

  def can?(%User{id: user_id}, action, resource)
  when action in [:update, :delete] do
    gt_zero = fn x -> x > 0 end

    from(ref in OrganizationUser, select: count(ref.id))
    |> where(user_id: ^user_id, organization_id: ^resource.id)
    |> Repo.one!
    |> gt_zero.()
  end

  def can?(_user, _action, _resource), do: true

  def scope(nil, _action, _query) do
    Organization
    |> where(private: false)
  end

  def scope(%User{id: user_id}, _action, _query) do
    from org in Organization, join: org_user in assoc(org, :organizations_users),
                              where: (org.private == false) or
                                     (org_user.user_id == ^user_id)
  end
end
