defmodule Poker.Web.FallbackController do
  use Poker.Web, :controller

  alias Poker.Web.ErrorView
  alias Poker.Web.ChangesetView


  def call(conn, {:error, {:not_found, message}}) do
    conn
    |> put_status(404)
    |> render(ErrorView, :"404", message: message)
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(404)
    |> render(ErrorView, :"404")
  end

  # This is a case where you do something like:
  # with true <- Organizations.admin?(user_id), do: something() end
  def call(conn, false) do
    conn
    |> put_status(403)
    |> render(ErrorView, :"403")
  end

  def call(conn, {:error, {:unauthorized, message}}) do
    conn
    |> put_status(401)
    |> render(ErrorView, :"401", message: message)
  end

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(401)
    |> render(ErrorView, :"401")
  end

  def call(conn, {:error, {:bad_request, message}}) do
    conn
    |> put_status(406)
    |> render(ErrorView, :"400", message: message)
  end

  def call(conn, {:error, :bad_request}) do
    conn
    |> put_status(406)
    |> render(ErrorView, :"400")
  end

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(ChangesetView, "error.json", changeset: changeset)
  end

  def call(conn, any) do
    IO.inspect {"fallback", any}
    conn
  end
end
