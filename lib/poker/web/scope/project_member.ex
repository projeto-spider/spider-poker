defmodule Poker.Web.Scope.ProjectMember do
  use Poker.Web, :scope

  alias Poker.{User, ProjectMember}

  def default(%{params: %{"project_id" => proj_id}} = conn) do
    ProjectMember
    |> where(project_id: ^proj_id)
    |> preload([user: :profile])
    |> distinct(true)
  end

  def scope(conn, _user, _action, _data) do
    default(conn)
  end
end
