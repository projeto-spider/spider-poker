defmodule Poker.Web.UserController do
  use Poker.Web, :controller
  alias Poker.Accounts

  @filters   ["username", "display_name", "email"]
  @searchers ["username", "display_name", "email"]

  def index(conn, params) do
    page =
      Accounts.query
      |> filter_params(params, @filters)
      |> search_params(params, @searchers)
      |> Repo.paginate(params)

    render(conn, "index.json", page: page)
  end

  def create(conn, ~m{data}) do
    with :ok         <- authorize(conn, :create),
         {:ok, user} <- Accounts.create(data)
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", user_path(conn, :show, user))
      |> render("show.json", data: user)
    end
  end

  def show(conn, ~m{id}) do
    with {:ok, user} <- Accounts.get(id),
         :ok         <- authorize(conn, :show, %{user: user})
    do
      render(conn, "show.json", data: user)
    end
  end

  def update(conn, %{"id" => id, "data" => params}) do
    with {:ok, user} <- Accounts.get(id),
         :ok         <- authorize(conn, :update, %{user: user}),
         {:ok, user} <- Accounts.update(user, params)
    do
      render(conn, "show.json", data: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    with {:ok, user} <- Accounts.get(id),
         :ok         <- authorize(conn, :delete, %{user: user}),
         {:ok, _}    <- Accounts.delete(user)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
