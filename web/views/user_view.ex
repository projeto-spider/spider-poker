defmodule Poker.UserView do
  use Poker.Web, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, Poker.UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, Poker.UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    user
  end
end
