defmodule Poker.Web.Policy.Session do
  use Poker.Web, :policy

  alias Poker.User

  def can?(%User{} = user, action, _data)
  when action == :show, do: true

  def can?(nil, action, _data)
  when action == :create, do: true

  def can?(_user, _action, _resource), do: false
end
