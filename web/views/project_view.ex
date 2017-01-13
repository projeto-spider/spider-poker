defmodule Poker.ProjectView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView

  location "/projects/:id"

  attributes [:name, :display_name, :description, :private]

  has_one :organization,
    serializer: Poker.OrganizationView,
    include: true,
    links: [
      self: "/projects/:id/relationships/organization"
    ]
end
