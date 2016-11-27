defmodule Poker.NotificationView do
  use Poker.Web, :view

  def render("index.json", %{notifications: notifications}) do
    %{data: render_many(notifications, Poker.NotificationView, "notification.json")}
  end

  def render("show.json", %{notification: notification}) do
    %{data: render_one(notification, Poker.NotificationView, "notification.json")}
  end

  def render("notification.json", %{notification: notification}) do
    notification
  end
end
