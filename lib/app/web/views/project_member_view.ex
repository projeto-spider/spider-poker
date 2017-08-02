defmodule App.Web.ProjectMemberView do
  use App.Web, :view
  alias App.Accounts.User
  alias App.Web.ProjectMemberView

  def render("index.json", %{members: members}) do
    %{data: render_many(members, ProjectMemberView, "member.json")}
  end

  def render("show.json", %{member: member}) do
    %{data: render_one(member, ProjectMemberView, "member.json")}
  end

  def render("member.json", %{project_member: %User{} = user}), do:
    render_one(user, App.Web.UserView, "user.json")
  def render("member.json", %{project_member: member}), do: member
end
