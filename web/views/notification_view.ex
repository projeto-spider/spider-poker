defmodule Poker.NotificationView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView
  alias Poker.Repo

  location "/notifications/:id"

  attributes [:content, :read]

  has_one :user,
    serializer: Poker.UserView,
    links: [
      self: "/users/:user_id"
    ]

  def user_id(notification, _conn) do
    notification
    |> Map.fetch!(:user_id)
  end

  def user(notification, _conn) do
    Poker.User
    |> Repo.get(notification.user_id)
  end
end
