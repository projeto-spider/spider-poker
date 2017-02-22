defmodule Poker.Project.Policy do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, User, Project, ProjectMember, OrganizationMember}

  def can?(nil, action, _resource)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}, action, %{organization_id: org_id})
  when action == :create do
    OrganizationMember.member?(org_id, user_id)
  end

  def can?(%User{id: user_id}, action, %{id: proj_id})
  when action in [:update, :delete] do
    ProjectMember.member?(proj_id, user_id)
  end

  def can?(_user, _action, _resource), do: true

  def scope(nil, _action, _query) do
    Project
    |> Project.where_is_public
    |> preload([:organization])
  end

  def scope(%User{id: user_id}, _action, _query) do
    Project
    |> Project.where_user_can_see(user_id)
    |> preload([:organization])
  end
end
