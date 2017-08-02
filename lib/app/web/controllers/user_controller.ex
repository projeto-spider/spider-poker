defmodule App.Web.UserController do
  use App.Web, :controller

  alias App.Repo
  alias App.Accounts
  alias App.Accounts.User
  alias App.Web.Session

  def index(conn, params) do
    page =
      User
      |> Repo.paginate(params)

    conn
    |> Scrivener.Headers.paginate(page)
    |> render("index.json", users: page)
  end

  def create(conn, %{"data" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "data" => user_params}) do
    user = Accounts.get_user!(id)

    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- same_user(current_user, user),
         {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)

    with {:ok, current_user} <- Session.current_user(conn),
         :ok <- same_user(current_user, user),
         {:ok, %User{}} <- Accounts.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end

  defp same_user(%User{id: a_id}, %User{id: b_id}) when a_id == b_id, do: :ok
  defp same_user(_john, _doe), do: {:error, :"401"}
end
