defmodule Poker.Plugs.AuthorizationPlug do
  import Guardian.Plug, only: [current_resource: 1]
  import Plug.Conn

  def ensure_param_is_logged_in_user(conn, opts \\ []) do
    param = Keyword.get opts, :param, "username"

    logged_in = if conn.assigns.logged_in do
      conn.assigns.logged_in
    else
      current_resource(conn)
    end

    if logged_in.username != conn.params[param] do
      conn
      |> send_resp(:unauthorized, "")
      |> halt
    else
      conn
    end
  end
end
