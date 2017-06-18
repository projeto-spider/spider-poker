defmodule Poker.Web.BacklogChannel do
  @moduledoc false
  use Phoenix.Channel

  import ShorterMaps
  alias Poker.Accounts.User
  alias Poker.Projects
  alias Poker.Projects.Project

  def join("backlog:" <> project_name, _params, socket) do
    case socket.assigns.user do
      %User{} = user ->
        case Projects.get(project_name) do
          {:ok, %Project{id: proj_id}} ->
            if Projects.member?(proj_id, user.id) do
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

  # Add to top
  def handle_in("unshift_story", ~m{title, description}, socket) do
    case Projects.add_story(project_id(socket), ~m{title, description}) do
      {:ok, {order, story}} ->
        broadcast!(socket, "unshift_story", ~M{order, story})

      {:error, _err} ->
        # TODO: properly tell he couldn't add a story
        nil
    end

    {:noreply, socket}
  end
  def handle_in("move_story", %{"story_id" => story_id, "position" => position}, socket) do
    case Projects.move_story(project_id(socket), story_id, position) do
      {:ok, order} ->
        broadcast!(socket, "order_change", ~M{order})

      {:error, _err} ->
        # TODO: properly tell he couldn't add a story
        nil
    end

    {:noreply, socket}
  end

  defp project_id(socket) do
    "backlog:" <> id = socket.topic
    id
  end
end
