defmodule App.Web.LayoutView do
  use App.Web, :view

  @manifest File.read!("priv/static/manifest.json") |> Poison.decode!

  def manifest(key) do
    @manifest[key]
  end

  def google_analytics_id do
    System.get_env("GA_ID") || ""
  end
end
