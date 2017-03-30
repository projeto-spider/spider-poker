defmodule Poker.Web.Policy.User do
  import Ecto.Query, only: [preload: 2]
  alias Poker.User

  def can?(%User{id: id}, action, resource)
  when action in [:update, :delete] do
    id == resource.id
  end

  def can?(_user, _action, _resource), do: true

  def scope(_user, _action, _query) do
    User
    |> preload([:profile])
  end
end
