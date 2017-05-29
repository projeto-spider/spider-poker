defmodule Poker.Web.GameChannel do
  @moduledoc false
  use Phoenix.Channel
  alias Poker.Web.Game
  alias Poker.Projects
  alias Poker.Projects.Project
  alias Poker.Accounts.User
  alias Poker.Web.Presence

  def join("game:" <> project_name, _params, socket) do
    case socket.assigns.user do
      %User{} = user ->
        case Projects.get(project_name) do
          {:ok, %Project{id: proj_id}} ->
            if Projects.member?(proj_id, user.id) do
              send(self(), :after_join)
              {:ok, socket}
            else
              {:error, %{reason: "unauthorized"}}
            end

          _ ->
            {:error, %{reason: "not found"}}
        end
      _ ->
        {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:after_join, socket) do
    {:ok, game} = Game.for(socket)
    payload = Game.display_public(game)
    push(socket, "game_state", %{game: payload})

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
end
