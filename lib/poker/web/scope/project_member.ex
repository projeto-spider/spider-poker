defmodule Poker.Web.Scope.ProjectMember do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.ProjectMember

  def default(%{params: %{"project_id" => proj_id}}) do
    ProjectMember
    |> where(project_id: ^proj_id)
    |> preload([user: :profile])
    |> distinct(true)
  end

  def scope(conn, _user, _action, _data) do
    default(conn)
  end
end
