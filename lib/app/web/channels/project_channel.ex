defmodule App.Web.ProjectChannel do
  @moduledoc false
  use Phoenix.Channel

  alias App.Web.Notify
  alias App.Presence
  alias App.Projects
  alias App.Projects.Project
  alias App.Projects.Story
  alias App.Projects.Game

  @state Game.state()

  def join("project:" <> project_id, _params, socket) do
    if Projects.member?(project_id, user(socket).id) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:after_join, socket) do
    push(socket, "presence_state", Presence.list(socket))
    {:ok, _} = Presence.track(socket, user(socket).id, %{
      online_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end
  def handle_info(:stop_voting, socket) do
    # TODO: stop voting even if the manager finished the game
    handle_in("game:voting:stop", 0, socket)
    {:noreply, socket}
  end

  def handle_in("story:unshift", attrs, socket) do
    case Projects.unshift_story(project!(socket), attrs) do
      {:ok, project, story} ->
        broadcast!(socket, "story:created", %{order: backlog(project), story: story})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to create story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("story:update", attrs, socket) do
    story = Projects.get_story!(attrs["story_id"])
    case Projects.update_story(story, attrs) do
      {:ok, story} ->
        broadcast!(socket, "story:updated", %{story: story})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to update story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("story:delete", %{"story_id" => id}, socket) do
    story = Projects.get_story!(id)
    project = Projects.get_project!(story.project_id)
    case Projects.delete_story(project, story) do
      {:ok, project, story} ->
        broadcast!(socket, "story:deleted", %{order: backlog(project), story_id: story.id})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to delete story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("substory:delete", %{"parent_id" => parent_id, "story_id" => id}, socket) do
    parent = Projects.get_story!(parent_id)
    story = Projects.get_story!(id)

    case Projects.delete_story(parent, story) do
      {:ok, parent, story} ->
        broadcast!(socket, "substory:deleted", %{parent_id: parent_id, order: backlog(parent), story_id: story.id})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to delete story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("story:move", %{"story_id" => id, "position" => position}, socket) do
    story = Projects.get_story!(id)
    project = Projects.get_project!(story.project_id)
    case Projects.move_story(project, story.id, position) do
      {:ok, project} ->
        broadcast!(socket, "story:moved", %{order: backlog(project)})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to move story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("substory:move", %{"parent_id" => parent_id, "story_id" => id, "position" => position}, socket) do
    parent = Projects.get_story!(parent_id)
    story = Projects.get_story!(id)
    case Projects.move_story(parent, story.id, position) do
      {:ok, parent} ->
        broadcast!(socket, "substory:moved", %{parent_id: parent_id, order: backlog(parent)})
      {:error, _reason} ->
        push(socket, "error", %{reason: "Failed to move story"})
    end
    
    {:noreply, socket}
  end
  def handle_in("game:create", %{"story_id" => story_id}, socket) do
    project = Projects.get_project!(project_id(socket))

    with :ok <- being_manager(project, socket) do
      story = Projects.get_story!(story_id)
      {:ok, game} = Projects.create_game(story)
      {:ok, project} = Projects.update_project(project, %{current_game: game.id})
      broadcast!(socket, "game:start", %{game: game, project: project})
      {:noreply, socket}
    end
  end
  def handle_in("game:get", _params, socket) do
    project = Projects.get_project!(project_id(socket))
    
    if project.current_game do
      game = Projects.get_game!(project.current_game)
      push(socket, "game:state", %{game: game})
    end

    {:noreply, socket}
  end
  def handle_in("game:stop", _params, socket) do
    project = Projects.get_project!(project_id(socket))
    
    if project.current_game do
      {:ok, _project} = Projects.update_project(project, %{current_game: nil})
      broadcast!(socket, "game:stop", %{})
    end

    {:noreply, socket}
  end
  def handle_in("game:message", %{"body" => body}, socket) do
    project = Projects.get_project!(project_id(socket))
    user_id = user(socket).id
    
    if project.current_game do
      message = %{user_id: user_id, body: body}
      broadcast! socket, "game:message", %{message: message}

      {:ok, _message} = Projects.create_message(project.current_game, user_id, body)
    end

    {:noreply, socket}
  end
  def handle_in("game:voting:start", _, socket) do
    project = Projects.get_project!(project_id(socket))

    with :ok <- being_manager(project, socket) do
      game = Projects.get_game!(project.current_game)

      duration = project.votation_time * 60
      voting_start = System.system_time(:seconds)
      voting_end = voting_start + duration

      :timer.send_after(duration * 1000, self(), :stop_voting)

      attrs = %{
        state: @state.voting,
        votes: %{},
        voting_start: DateTime.from_unix!(voting_start),
        voting_end: DateTime.from_unix!(voting_end)
      }
      {:ok, game} = Projects.update_game(game, attrs)

      broadcast!(socket, "game:state", %{game: game})

      {:noreply, socket}
    end
  end
  def handle_in("game:voting:stop", _, socket) do
    project = Projects.get_project!(project_id(socket))

    with :ok <- being_manager(project, socket) do
      game = Projects.get_game!(project.current_game)

      duration = project.votation_time * 60
      voting_end = System.system_time(:seconds)

      attrs = %{
        state: @state.discussion,
        voting_end: DateTime.from_unix!(voting_end)
      }
      {:ok, game} = Projects.update_game(game, attrs)

      broadcast!(socket, "game:state", %{game: game})

      {:noreply, socket}
    end
  end
  def handle_in("game:voting:vote", %{"estimation" => estimation}, socket) do
    project = Projects.get_project!(project_id(socket))
    game = Projects.get_game!(project.current_game)

    votes = Map.put(game.votes, user(socket).id, estimation)

    attrs = %{
      votes: votes
    }
    {:ok, game} = Projects.update_game(game, attrs)

    broadcast!(socket, "game:state", %{game: game})

    {:noreply, socket}
  end
  def handle_in("game:discussion:score", %{"estimation" => estimation}, socket) do
    project = Projects.get_project!(project_id(socket))

    with :ok <- being_manager(project, socket) do
      game = Projects.get_game!(project.current_game)
      story = Projects.get_story!(game.story_id)

      attrs = %{
        estimation: estimation
      }
      case Projects.update_story(story, attrs) do
        {:ok, story} ->
          broadcast!(socket, "story:updated", %{story: story})
        {:error, _reason} ->
          push(socket, "error", %{reason: "Failed to update story"})
      end

      attrs = %{
        state: @state.idle
      }
      {:ok, game} = Projects.update_game(game, attrs)

      broadcast!(socket, "game:state", %{game: game})

      {:noreply, socket}
    end
  end
  def handle_in("game:discussion:create_substory", attrs, socket) do
    project = Projects.get_project!(project_id(socket))

    with :ok <- being_manager(project, socket) do
      game = Projects.get_game!(project.current_game)
      parent = Projects.get_story!(game.story_id)

      case Projects.unshift_story(parent, attrs) do
        {:ok, parent, story} ->
          broadcast!(socket, "substory:created", %{
            parent_id: parent.id,
            order: backlog(parent),
            story: story
          })

        {:error, _reason} ->
          push(socket, "error", %{reason: "Failed to create story"})
      end

      {:noreply, socket}
    end
  end

  defp user(socket), do: socket.assigns.user

  defp project_id(%{topic: "project:" <> id}), do: id

  defp project!(socket), do: Projects.get_project!(project_id(socket))

  defp backlog(%Project{backlog: backlog}), do: backlog
  defp backlog(%Story{backlog: backlog}), do: backlog

  defp being_manager(project, socket) do
    if project.manager_id == user(socket).id do
      :ok
    else
      {:noreply, socket}
    end
  end
end
