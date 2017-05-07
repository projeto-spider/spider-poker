defmodule Poker.Web.UserSocket do
  @moduledoc false
  use Phoenix.Socket
  import Guardian.Phoenix.Socket

  ## Channels
  channel "game:*", Poker.Web.GameChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  def connect(%{"token" => token}, socket) do
    case sign_in(socket, token) do
      {:ok, authed_socket, _guardian_params} ->
        {:ok, assign(socket, :user, current_resource(authed_socket))}
      _ ->
        {:ok, socket}
    end
  end

  def id(_socket), do: nil
end
