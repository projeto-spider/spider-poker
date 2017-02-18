defmodule Poker.Plugs.SessionPlug do
  alias Guardian.Plug.{EnsureAuthenticated}
  import Guardian.Plug, only: [current_resource: 1]
  import Plug.Conn

  def ensure_authenticated(conn, _opts \\ %{}) do
    EnsureAuthenticated.call conn, EnsureAuthenticated.init(handler: App.ErrorHandler)
  end

  def preload_session(conn, opts \\ %{}) do
    user = current_resource conn
    assign conn, :current_user, user
  end
end
