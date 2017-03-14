defmodule Poker.Web.UserController do
  use Poker.Web, :controller

  alias Poker.User

  # Scope

  def records(conn) do
    default =
      scope(conn, User)
      |> filter_params(conn, ["username"])
      |> search_params(conn, ["username"])

    case nested_resource(conn) do
      {"organizations", id} ->
        from u in default,
          join: o in assoc(u, :organizations_users),
          where: o.organization_id == ^id

      _ ->
        default
    end
  end

  # Actions

  def index(conn, _params) do
    users =
      records(conn)
      |> preload([:profile])
      |> Repo.all

    render(conn, "index.json", data: users)
  end

  def create(conn, %{"data" => params}) do
    changeset = User.create_changeset(%User{}, params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", user_path(conn, :show, user))
        |> render("show.json", data: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    user =
      records(conn)
      |> preload([:profile])
      |> Repo.get!(id)

    render(conn, "show.json", data: user)
  end

  def update(conn, %{"id" => id, "data" => params}) do
    user =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, user

    changeset = User.update_changeset(user, params)

    case Repo.update(changeset) do
      {:ok, user} ->
        render(conn, "show.json", data: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user =
      records(conn)
      |> Repo.get!(id)

    authorize! conn, user

    Repo.delete!(user)

    send_resp(conn, :no_content, "")
  end
end
