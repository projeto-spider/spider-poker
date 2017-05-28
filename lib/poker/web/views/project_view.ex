defmodule Poker.Web.ProjectView do
  use Poker.Web, :view

  alias Poker.Web.ProjectView

  def render("show.json", %{data: data}) do
    %{data: render_one(data, ProjectView, "single.json")}
  end

  def render("single.json", %{project: project}) do
    project
    |> Map.take([:id, :organization_id, :name, :display_name, :description, :private])
  end

  def render("backlog.json", %{order: order, stories: stories}) do
    rendered =
      render_many(stories, __MODULE__, "story.json")
      |> Enum.map(fn %{id: id} = attrs ->
        {id, Map.delete(attrs, :id)}
      end)
      |> Enum.into(%{})

    %{
      meta: %{order: order},
      data: rendered
    }
  end

  def render("story.json", %{project: story}) do
    story
    |> Map.take([:id, :title, :description, :estimation])
  end
end
