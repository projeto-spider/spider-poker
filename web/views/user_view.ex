defmodule Poker.UserView do
  use Poker.Web, :view

  alias Poker.UserView

  def render("index.json", %{data: data}) do
    %{data: render_many(data, UserView, "single.json")}
  end

  def render("show.json", %{data: data}) do
    %{data: render_one(data, UserView, "single.json")}
  end

  def render("single.json", %{user: user}) do
    profile = render_one(user.profile, Poker.ProfileView, "single.json")

    user
    |> Map.take([:id, :username, :email])
    |> Map.put(:profile, profile)
  end
end
