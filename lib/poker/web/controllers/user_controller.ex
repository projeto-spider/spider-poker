defmodule Poker.Web.UserController do
  use Poker.Web, :controller

  alias Poker.User

  def index(conn, _params) do
    users =
      scope(conn)
      |> Repo.all

    render(conn, "index.json", data: users)
  end

  def create(conn, %{"data" => params}) do
    changeset = User.create_changeset(params)

    with :ok         <- authorize(conn, :create),
         {:ok, user} <- Repo.insert(changeset)
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", user_path(conn, :show, user))
      |> render("show.json", data: user)
    end
  end

  def show(conn, %{"id" => id}) do
    with user <- Repo.get!(scope(conn), id),
         :ok  <- authorize(conn, :show, %{user: user})
    do
      render(conn, "show.json", data: user)
    end
  end

  def update(conn, %{"id" => id, "data" => params}) do
    with user        <- Repo.get!(scope(conn), id),
         :ok         <- authorize(conn, :update, %{user: user}),
         changeset   <- User.update_changeset(user, params),
         {:ok, user} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with user     <- Repo.get!(scope(conn), id),
         :ok      <- authorize(conn, :delete, %{user: user}),
         {:ok, _} <- Repo.delete(user)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
