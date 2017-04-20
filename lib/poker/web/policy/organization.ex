defmodule Poker.Web.Policy.Organization do
  @moduledoc false
  use Poker.Web, :policy

  alias Poker.Organizations
  alias Poker.Organizations.Organization
  alias Poker.Accounts.User

  def can?(%User{}, :create, _data), do: true
  def can?(nil, :create, _data), do: false

  def can?(%User{id: user_id}, action, %{organization: %Organization{id: org_id}})
  when action in [:update, :delete] do
    Organizations.admin?(org_id, user_id)
  end
  def can?(_user, action, _data)
  when action in [:update, :delete], do: false

  def can?(_user, _action, _data), do: true
end
