defmodule Poker.UserController do
  use Poker.Web, :controller

  alias Poker.User

  plug :ensure_authenticated when action in [:update, :delete]
  plug :fetch_logged_in_user when action in [:update, :delete]
  plug :ensure_param_is_logged_in_user when action in [:update, :delete]

  def index(conn, _params) do
    users = Repo.all User.with_profile

    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"username" => username}) do
    user = Repo.get_by! User.with_profile, username: username
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"username" => username, "user" => user_params}) do
    user = conn.assigns.logged_in

    changeset = User.update_changeset(user, user_params)

    case Repo.update(changeset) do
      {:ok, user} ->
        render(conn, "show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, _params) do
    user = conn.assigns.logged_in

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)

    send_resp(conn, :no_content, "")
  end
end
