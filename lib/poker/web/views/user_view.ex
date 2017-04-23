defmodule Poker.Web.UserView do
  use Poker.Web, :view

  alias Poker.Web.UserView

  def render("show.json", %{data: data}) do
    %{data: render_one(data, UserView, "single.json")}
  end

  def render("single.json", %{user: user}) do
    user
    |> Map.take([:id, :username, :email, :display_name, :bio, :location,
                 :company, :contact, :url])
  end
end
