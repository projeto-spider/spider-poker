defmodule App.Web.ProjectChannel do
  @moduledoc false
  use Phoenix.Channel

  alias App.Projects
  alias App.Projects.Project

  def join("project:" <> project_id, _params, socket) do
    if Projects.member?(project_id, user(socket).id) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
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

  defp user(socket), do: socket.assigns.user

  defp project_id(%{topic: "project:" <> id}), do: id

  defp project!(socket), do: Projects.get_project!(project_id(socket))

  defp backlog(%Project{backlog: backlog}), do: backlog
end
