defmodule Poker.UserView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView

  location "/users/:id"

  attributes [:username, :email]

  has_one :profile,
    serializer: Poker.ProfileView,
    include: true,
    links: [
      self: "/users/:id/relationships/profile"
    ]
end
