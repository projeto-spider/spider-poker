defmodule Poker.Web.NotificationController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.{Notification, User}

  plug :preload_session when action in [:index, :update]
  plug JaResource, only: [:index, :update]

  # Scope

  def records(conn) do
    scope conn, Notification
  end

  # Handlers

  def handle_update(conn, notification, attributes) do
    authorize! conn, notification

    Notification.update_changeset notification, attributes
  end

  # Filters

  filterable_by ["user_id"]
end
