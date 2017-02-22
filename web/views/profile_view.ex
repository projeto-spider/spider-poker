defmodule Poker.ProfileView do
  use Poker.Web, :view

  alias Poker.ProfileView

  def render("index.json", %{data: data}) do
    %{data: render_many(data, ProfileView, "single.json")}
  end

  def render("show.json", %{data: data}) do
    %{data: render_one(data, ProfileView, "single.json")}
  end

  def render("single.json", %{profile: profile}) do
    profile
    |> Map.take([:name, :bio, :location, :company, :contact, :url])
  end
end
