defmodule Poker.MessageController do
  use Poker.Web, :controller

  alias Poker.{Message, User}

  plug :ensure_authenticated
  plug :preload_session
  plug :ensure_param_is_logged_in_user, [param: "user_username"]
    when not action in [:create]

  def index(conn, _params) do
    messages = Repo.all Message.with_from_user
    render(conn, "index.json", messages: messages)
  end

  def create(conn, %{"message" => message_params}) do
    params = Map.put message_params, "from_user", conn.assigns.logged_in
    changeset = Message.create_changeset %Message{}, params

    case Repo.insert(changeset) do
      {:ok, message} ->
        conn
        |> send_resp(:created, "")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "message" => message_params}) do
    message = Repo.get! Message.with_from_user, id
    changeset = Message.update_changeset message, message_params

    case Repo.update(changeset) do
      {:ok, message} ->
        render(conn, "show.json", message: message)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
