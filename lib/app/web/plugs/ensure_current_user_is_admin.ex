defmodule App.Web.Plugs.EnsureCurrentUserIsAdmin do
  @moduledoc """
  Plug that only authorizes if current user is admin
  """

  import Plug.Conn, only: [put_status: 2, halt: 1]
  import Phoenix.Controller, only: [render: 3]

  alias App.Accounts.User
  alias App.Web.Session

  @doc false
  def init(opts), do: opts

  @doc false
  def call(conn, _opts) do
    case Session.current_user(conn) do
      {:ok, %User{admin?: true}} ->
        conn
      _ ->
        conn
        |> put_status(:bad_request)
        |> render(App.Web.ErrorView, :"400")
        |> halt
    end
  end
end