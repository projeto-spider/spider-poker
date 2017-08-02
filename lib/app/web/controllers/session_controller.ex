defmodule App.Web.SessionController do
  use App.Web, :controller

  alias App.Web.Session

  def create(conn, %{"data" => data}) do
    case Session.create_session(data) do
      {:ok, token} ->
        conn
        |> put_status(:created)
        |> render("show.json", session: %{token: token})
      _ ->
        {:error, :"401"}
    end
  end

  def show(conn, _params) do
    with {:ok, user} <- Session.current_user(conn) do
      render(conn, App.Web.UserView, "show.json", user: user)
    end
  end
end
