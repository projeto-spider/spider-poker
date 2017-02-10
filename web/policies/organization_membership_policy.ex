defmodule Poker.OrganizationMembership.Policy do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, User, OrganizationMembership}

  def can?(nil, action, _resource)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}, action, resource)
  when action in [:create] do
    gt_zero = fn x -> x > 0 end

    admin? = from(ref in OrganizationMembership, select: count(ref.id))
    |> where(user_id: ^user_id, organization_id: ^resource.organization_id, role: "admin")
    |> Repo.one!
    |> gt_zero.()

    if admin? do
      count = from(ref in OrganizationMembership, select: count(ref.id))
      |> where(user_id: ^resource.user_id, organization_id: ^resource.organization_id)
      |> Repo.one!

      if count == 0 do
        true
      else
        {:error, :bad_request}
      end
    else
      false
    end
  end

  def can?(%User{id: user_id}, action, resource)
  when action in [:update, :delete] do
    gt_zero = fn x -> x > 0 end

    admin? = from(ref in OrganizationMembership, select: count(ref.id))
    |> where(user_id: ^user_id, organization_id: ^resource.organization_id, role: "admin")
    |> Repo.one!
    |> gt_zero.()
  end

  def can?(_user, _action, _resource), do: false

  def scope(_user, _action, _query) do
    OrganizationMembership
    |> preload([user: :profile])
  end
end
