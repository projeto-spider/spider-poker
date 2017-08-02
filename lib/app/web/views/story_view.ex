defmodule App.Web.StoryView do
  use App.Web, :view
  alias App.Web.StoryView

  def render("index.json", %{backlog: backlog}) do
    %{data: render_many(backlog, StoryView, "story.json")}
  end

  def render("story.json", %{story: story}), do: story
end
