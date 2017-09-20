defmodule App.Web.GameView do
  use App.Web, :view
  alias App.Web.GameView

  def render("index.json", %{games: games}) do
    %{data: render_many(games, GameView, "game.json")}
  end

  def render("game.json", %{game: game}) do
    %{id: game.id,
      inserted_at: game.inserted_at,
      story_title: game.story.title}
  end
end
