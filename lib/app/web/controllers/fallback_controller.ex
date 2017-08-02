defmodule App.Web.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use App.Web, :controller

  def call(conn, {:error, :"400"}) do
    conn
    |> put_status(:bad_request)
    |> render(App.Web.ErrorView, :"400")
  end

  def call(conn, {:error, :"401"}) do
    conn
    |> put_status(:unauthorized)
    |> render(App.Web.ErrorView, :"401")
  end

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(App.Web.ChangesetView, "error.json", changeset: changeset)
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> render(App.Web.ErrorView, :"404")
  end
end
