defmodule App.Web.MessageView do
  use App.Web, :view
  alias App.Web.MessageView

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    %{id: message.id,
      body: message.body,
      user: message.user}
  end
end
