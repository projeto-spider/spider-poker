defmodule Poker.UserController do
  use Poker.Web, :controller

  alias Poker.User

  plug EnsureAuthenticated when action in [:update, :delete]
  plug :prefetch_user when action in [:show, :update, :delete]
  plug :is_me when action in [:update, :delete]

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

  def show(conn, _params) do
    render(conn, "show.json", user: conn.assigns.user)
  end

  def update(conn, %{"username" => username, "user" => user_params}) do
    user = Repo.get_by!(User.with_profile, username: username)

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
    user = conn.assigns.user

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)

    send_resp(conn, :no_content, "")
  end

  # Helpers

  defp prefetch_user(%{params: %{"username" => username}} = conn, _opts) do
    case Repo.get_by(User.with_profile, username: username) do
      nil ->
        conn
        |> send_resp(:not_found, "User doesn't exist")
      user ->
        conn
        |> assign(:user, user)
      end
  end

  defp is_me(%{params: %{"username" => username}} = conn, _opts) do
    logged_in = current_resource(conn)

    if logged_in.username != username do
      conn
      |> send_resp(:unauthorized, "Trying to modify users other than self")
    else
      conn
    end
  end
end
