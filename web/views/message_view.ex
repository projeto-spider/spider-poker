defmodule Poker.MessageView do
  use Poker.Web, :view

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, Poker.MessageView, "message.json")}
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, Poker.MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    message
  end
end
