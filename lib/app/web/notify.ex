defmodule App.Web.Notify do
  @moduledoc """
  Module to handle Channel notifications
  """

  import Ecto.Query

  alias App.Repo
  alias App.Web.Endpoint
  alias App.Projects.Member

  def project_updated(project, by_user) do
    payload = %{project: project, by_user: by_user}
    broadcast_for_other_members(project.id, by_user, "project:updated", payload)
  end

  def project_deleted(project, by_user) do
    payload = %{project_id: project.id, by_user: by_user}
    broadcast_for_other_members(project.id, by_user, "project:deleted", payload)
  end

  def join_project(project, user_id) do
    Endpoint.broadcast!(topic(user_id), "project:joined", %{project: project})
  end

  def left_project(project_id, user_id) do
    Endpoint.broadcast!(topic(user_id), "project:left", %{project_id: project_id})
  end

  defp topic(user_id), do: "notifications:#{user_id}"

  defp broadcast_for_other_members(project_id, by_user, event, payload) do
    for user_id <- project_members_ids(project_id), user_id != by_user.id do
      Endpoint.broadcast!(topic(user_id), event, payload)
    end
  end

  defp project_members_ids(project_id) do
    query =
      from m in Member,
        where: m.project_id == ^project_id,
        select: m.user_id
    Repo.all(query)
  end
end
