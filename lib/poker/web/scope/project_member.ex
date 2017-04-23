defmodule Poker.Web.Scope.ProjectMember do
  @moduledoc false
  use Poker.Web, :scope

  alias Poker.Projects

  def scope(%{params: ~m{project_id}}, _user, _action, _data) do
    Projects.query_members(project_id)
  end
end
