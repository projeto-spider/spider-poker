defmodule Poker.Web.Policy.Project do
  import Ecto.Query, only: [from: 2, where: 2, preload: 2]
  alias Poker.{Repo, User, Project, ProjectMember, OrganizationMember}

  def can?(nil, action, _data)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}, action, %{organization_id: org_id})
  when action == :create do
    OrganizationMember.member?(org_id, user_id)
  end

  def can?(%User{id: user_id}, action, %{project_id: proj_id})
  when action in [:update, :delete] do
    ProjectMember.member?(proj_id, user_id)
  end

  def can?(_user, action, _data)
  when action in [:index, :show], do: true

  def can?(_user, _action, _data), do: false
end
