defmodule Poker.ProjectView do
  use Poker.Web, :view

  def render("index.json", %{projects: projects}) do
    %{data: render_many(projects, Poker.ProjectView, "project.json")}
  end

  def render("show.json", %{project: project}) do
    %{data: render_one(project, Poker.ProjectView, "project.json")}
  end

  def render("project.json", %{project: project}) do
    project
  end
end
