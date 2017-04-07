defmodule Poker.Web.OrganizationView do
  use Poker.Web, :view

  alias Poker.Web.OrganizationView

  def render("show.json", %{data: data}) do
    %{data: render_one(data, OrganizationView, "single.json")}
  end

  def render("single.json", %{organization: organization}) do
    organization
    |> Map.take([:id, :name, :display_name, :description, :location,
                 :url, :private])
  end
end
