defmodule Poker.Web.Policy.User do
  @moduledoc false
  use Poker.Web, :policy

  alias Poker.Accounts.User

  def can?(%user{admin?: true}, _action, _data), do true

  def can?(%User{id: user_id}, action, %{user: user})
  when action in [:update, :delete] do
    user_id == user.id
  end

  def can?(_user, _action, _data), do: true
end
