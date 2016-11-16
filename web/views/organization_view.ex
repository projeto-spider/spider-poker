defmodule Poker.OrganizationView do
  use Poker.Web, :view

  def render("index.json", %{organizations: organizations}) do
    %{data: render_many(organizations, Poker.OrganizationView, "organization.json")}
  end

  def render("show.json", %{organization: organization}) do
    %{data: render_one(organization, Poker.OrganizationView, "organization.json")}
  end

  def render("organization.json", %{organization: organization}) do
    organization
  end
end
