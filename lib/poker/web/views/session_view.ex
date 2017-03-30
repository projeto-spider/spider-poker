defmodule Poker.Web.SessionView do
  use Poker.Web, :view

  def render("token.json", %{token: token, expiry: expiry}) do
    %{data: %{token: token, expiry: expiry}}
  end
end
