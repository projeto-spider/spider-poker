defmodule Poker.ProjectView do
  use Poker.Web, :view

  alias Poker.ProjectView

  def render("index.json", %{data: data}) do
    %{data: render_many(data, ProjectView, "single.json")}
  end

  def render("show.json", %{data: data}) do
    %{data: render_one(data, ProjectView, "single.json")}
  end

  def render("single.json", %{project: project}) do
    project
    |> Map.take([:id, :organization_id, :name, :display_name, :description, :private])
  end
end
