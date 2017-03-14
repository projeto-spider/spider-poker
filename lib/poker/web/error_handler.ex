defmodule Poker.Web.ErrorHandler do
  use Poker.Web, :controller
  require Logger
  alias Poker.Web.ErrorView

  def unauthenticated(conn, _reason) do
    conn
    |> put_status(401)
    |> render(ErrorView, :"401", %{})
  end

  # It's a special case where plug doesn't negotiate content type so I explictly
  # render json views
  def handle_errors(conn, %{reason: %{plug_status: status}})
  when status in [404, 406] do
    conn
    |> put_status(status)
    |> render(ErrorView, "#{status}.json", %{})
  end

  def handle_errors(conn, %{reason: reason}) do
    status = Plug.Exception.status(reason)

    status_atom =
      status
      |> Integer.to_string
      |> String.to_atom

    conn
    |> put_status(status)
    |> render(ErrorView, status_atom, %{})
  end
end
