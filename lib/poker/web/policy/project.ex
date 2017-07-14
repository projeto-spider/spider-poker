defmodule Poker.Web.Policy.Project do
  @moduledoc false
  use Poker.Web, :policy

  alias Poker.Projects
  alias Poker.Organizations
  alias Poker.Accounts.User

  def can?(%user{admin?: true}, _action, _data), do: true

  def can?(%User{id: user_id}, :create, %{organization_id: org_id}) do
    Organizations.member?(org_id, user_id)
  end

  def can?(%User{id: user_id}, action, %{project_id: proj_id})
  when action in [:update, :delete] do
    Projects.manager?(proj_id, user_id)
  end

  def can?(_user, action, _data)
  when action in [:create, :update, :delete], do: false

  def can?(_user, _action, _data), do: true
end
