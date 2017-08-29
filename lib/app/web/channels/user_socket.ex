defmodule App.Web.UserSocket do
  use Phoenix.Socket

  alias App.Web.Session
  alias App.Accounts

  channel "project:*", App.Web.ProjectChannel
  channel "notifications:*", App.Web.NotificationsChannel

  transport :websocket, Phoenix.Transports.WebSocket, timeout: 45_000
  transport :longpoll, Phoenix.Transports.LongPoll, timeout: 45_000

  # Only accept valid tokens when connecting to the socket
  def connect(%{"token" => token}, socket) do
    with {:ok, user_id} <- Session.verify_token(token) do
      user = Accounts.get_user!(user_id)
      {:ok, assign(socket, :user, user)}
    else
      _ -> {:error, %{reason: "unauthorized"}}
    end
  end
  def connect(_params, _socket), do: {:error, %{reason: "unauthorized"}}

  def id(socket), do: "user_socket:#{socket.assigns.user.id}"
end
