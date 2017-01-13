defmodule Poker.OrganizationView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView

  location "/organizations/:id"

  attributes [:name, :display_name, :description, :location, :url, :private]
end
