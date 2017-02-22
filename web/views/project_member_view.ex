defmodule Poker.ProjectMemberView do
  use Poker.Web, :view

  alias Poker.ProjectMemberView

  def render("index.json", %{data: projects_members}) do
    %{data: render_many(projects_members, ProjectMemberView, "single.json")}
  end

  def render("show.json", %{data: project_member}) do
    %{data: render_one(project_member, ProjectMemberView, "single.json")}
  end

  def render("single.json", %{project_member: member}) do
    user = render_one(member.user, Poker.UserView, "single.json")

    member
    |> Map.take([:user_id, :project_id, :role])
    |> Map.put(:user, user)
  end
end
