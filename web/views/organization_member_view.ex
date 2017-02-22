defmodule Poker.OrganizationMemberView do
  use Poker.Web, :view

  alias Poker.OrganizationMemberView

  def render("index.json", %{data: data}) do
    %{data: render_many(data, OrganizationMemberView, "single.json")}
  end

  def render("show.json", %{data: data}) do
    %{data: render_one(data, OrganizationMemberView, "single.json")}
  end

  def render("single.json", %{organization_member: member}) do
    user = render_one(member.user, Poker.UserView, "single.json")

    member
    |> Map.take([:user_id, :organization_id, :role])
    |> Map.put(:user, user)
  end
end
