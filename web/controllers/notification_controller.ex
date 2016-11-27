defmodule Poker.NotificationController do
  use Poker.Web, :controller

  alias Poker.{Notification, User}

  plug :ensure_user

  def index(conn, _params) do
    user_id = conn.assigns.user.id
    notifications = Repo.all Notification.from_user_id Notification, user_id
    render(conn, "index.json", notifications: notifications)
  end

  def update(conn, %{"id" => id, "notification" => notification_params}) do
    user_id = conn.assigns.user.id
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

  # Plugs

  defp ensure_user(%{params: %{"user_id" => username}} = conn, _opts) do
    user = Repo.get_by User, username: username

    case user do
      nil ->
        send_resp conn, :not_found, "User not found."
      user ->
        assign conn, :user, user
    end
  end
end
