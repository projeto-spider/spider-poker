defmodule Poker.Web.Plugs.PreloadSession do
  import Plug.Conn, only: [assign: 3]
  import Guardian.Plug, only: [current_resource: 1]

  def init(_opts), do: []

  def call(conn, _opts) do
    user = current_resource(conn)
    assign(conn, :current_user, user)
  end
end
