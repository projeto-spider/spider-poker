defmodule Poker.NotificationController do
  use Poker.Web, :controller

  alias Poker.{Notification, User}

  plug :ensure_authenticated
  plug :fetch_logged_in_user
  plug :ensure_param_is_logged_in_user, param: "user_username"

  def index(conn, _params) do
    user_id = conn.assigns.logged_in.id
    notifications = Repo.all Notification.from_user_id Notification, user_id
    render(conn, "index.json", notifications: notifications)
  end

  def update(conn, %{"id" => id, "notification" => notification_params}) do
    user_id = conn.assigns.logged_in.id
    notification = Notification
                   |> Notification.from_user_id(user_id)
                   |> Repo.get!(id)

    changeset = Notification.update_changeset(notification, notification_params)

    case Repo.update(changeset) do
      {:ok, notification} ->
        render(conn, "show.json", notification: notification)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
