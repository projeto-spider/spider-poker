defmodule Poker.Plugs.SessionPlug do
  alias Guardian.Plug.{EnsureAuthenticated}
  import Guardian.Plug, only: [current_resource: 1]
  import Plug.Conn

  def ensure_authenticated(conn, opts \\ %{}) do
    EnsureAuthenticated.call conn, EnsureAuthenticated.init(opts)
  end

  def fetch_logged_in_user(conn, opts \\ %{}) do
    user = current_resource(conn)
    assign conn, :logged_in, user
  end
end
