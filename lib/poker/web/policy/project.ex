defmodule Poker.Web.Policy.Project do
  @moduledoc false
  alias Poker.ProjectMember
  alias Poker.Organizations
  alias Poker.Accounts.User

  def can?(nil, action, _data)
  when action in [:create, :update, :delete], do: false

  def can?(%User{id: user_id}, action, %{organization_id: org_id})
  when action == :create do
    Organizations.member?(org_id, user_id)
  end

  def can?(%User{id: user_id}, action, %{project_id: proj_id})
  when action in [:update, :delete] do
    ProjectMember.member?(proj_id, user_id)
  end

  def can?(_user, action, _data)
  when action in [:index, :show], do: true

  def can?(_user, _action, _data), do: false
end
