defmodule Poker.Project.Policy do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, User, Project, OrganizationUser}

  def can?(nil, action, _resource)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}, action, resource)
  when action in [:create, :update, :delete] do
    gt_zero = fn x -> x > 0 end

    from(ref in OrganizationUser, select: count(ref.id))
    |> where(user_id: ^user_id, organization_id: ^resource.organization_id)
    |> Repo.one!
    |> gt_zero.()
  end

  def can?(_user, _action, _resource), do: true

  def scope(nil, _action, _query) do
    Project
    |> where(private: false)
    |> preload([:organization])
  end

  def scope(%User{id: user_id}, _action, _query) do
    from proj in Project, join: user in assoc(proj, :users),
                          where: (proj.private == false) or
                                 (user.id == ^user_id),
                          preload: [:organization]
  end
end
