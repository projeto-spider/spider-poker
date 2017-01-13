defmodule Poker.ProfileView do
  use Poker.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :bio, :location, :company, :contact, :url]
end
