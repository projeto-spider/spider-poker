defmodule App.Web.ErrorView do
  use App.Web, :view

  def render("400.json", _assigns) do
    error(400, "bad request")
  end
  def render("400.html", _assigns) do
    "Bad request"
  end

  def render("401.json", _assigns) do
    error(401, "unauthorized")
  end
  def render("401.html", _assigns) do
    "unauthorized"
  end

  def render("404.json", _assigns) do
    error(404, "not found")
  end
  def render("404.html", _assigns) do
    "Not found"
  end

  def render("500.json", _assigns) do
    error(500, "internal server error")
  end
  def render("500.html", _assigns) do
    "Internal server error"
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.html", assigns
  end
end
