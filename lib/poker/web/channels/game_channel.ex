defmodule Poker.Web.GameChannel do
  @moduledoc false
  use Phoenix.Channel
  alias Poker.Accounts.User
  alias Poker.Web.Presence

  def join("game:lobby", _message, socket) do
    case socket.assigns.user do
      %User{} = user ->
        send(self(), :after_join)
        {:ok, socket}
      _ ->
        {:error, %{reason: "unauthorized"}}
    end
  end
  def join("game:" <> _private_game_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info(:after_join, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, socket.assigns.user.id, %{
      online_at: inspect(System.system_time(:seconds))
    })

    {:noreply, socket}
  end

  def handle_in("message", %{"body" => body}, socket) do
    message = %{
      user_id: socket.assigns.user.id,
      body: body
    }

    broadcast! socket, "message", %{message: message}
    {:noreply, socket}
  end

  def handle_out("message", payload, socket) do
    push socket, "message", payload
    {:noreply, socket}
  end

  # def handle_out("user_joined", payload, socket) do
    # push socket, "user_joined", payload
    # {:noreply, socket}
  # end
end
