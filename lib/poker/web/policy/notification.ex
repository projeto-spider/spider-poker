defmodule Poker.Web.Notification.Policy do
  import Ecto.Query, only: [where: 2]
  alias Poker.Notification
  alias Poker.Accounts.User

  def can?(%user{admin?: true}, _action, _data), do: true

  def can?(%User{id: id}, action, resource)
  when action in [:update, :delete] do
    id == resource.user_id
  end

  def can?(_user, _action, _resource), do: false

  def scope(%User{id: user_id}, _action, _query) do
    Notification
    |> where(user_id: ^user_id)
  end
end
