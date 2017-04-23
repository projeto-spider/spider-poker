defmodule Poker.Projects do
  @moduledoc false
  import Ecto.{Query, Changeset}, warn: false
  alias Poker.Repo
  alias Poker.Pattern
  alias Poker.Accounts.User
  alias Poker.Projects.Project
  alias Poker.Projects.Member

  def query, do: Project

  def query_public do
    from p in Project,
    distinct: p.id,
    join: o in assoc(p, :organization),
    where: o.private == false and p.private == false
  end

  def query_visible_to(%User{id: user_id}) do
    from p in Project,
    distinct: p.id,
    join: o in assoc(p, :organization),
    left_join: om in assoc(o, :organizations_members),
    left_join: pm in assoc(p, :projects_members),
    where: (o.private == false or om.user_id == ^user_id) and
           (p.private == false or pm.user_id == ^user_id)
  end
  def query_visible_to(_), do: query_public()

  def get(scope \\ Project, id) do
    if Pattern.numeric?(id) do
      Repo.soft_get(scope, id)
    else
      Repo.soft_get_by(scope, name: id)
    end
  end

  def create(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> cast(attrs, [:organization_id])
    |> Project.default_display_name
    |> Project.validate
    |> Repo.insert
  end

  def update(%Project{} = project, attrs) do
    project
    |> Project.changeset(attrs)
    |> Project.validate
    |> Repo.update
  end

  def delete(%Project{} = project) do
    Repo.delete(project)
  end

  def can_see?(proj_id, user_id) do
    scope =
      if is_nil(user_id) do
        query_public()
      else
        query_visible_to(%User{id: user_id})
      end

    query =
      from(m in scope, select: count(m.id, :distinct))

    case Repo.soft_get(query, proj_id) do
      {:ok, 1} ->
        :ok
      {:ok, _} ->
        {:error, :not_found}
    end
  end

  # Membership

  def query_members(proj_name)
  when is_binary(proj_name) do
    from m in Member,
    preload: [:user],
    join: o in assoc(m, :project),
    where: o.name == ^proj_name
  end
  def query_members(proj_id) do
    Member
    |> preload([:user])
    |> where(project_id: ^proj_id)
  end

  def get_member(proj_id, id) do
    query =
      Member
      |> preload([:user])

    if Pattern.numeric?(id) do
      Repo.soft_get_by(query, project_id: proj_id, user_id: id)
    else
      Repo.soft_get_by(query, project_id: proj_id, username: id)
    end
  end

  def add_member(proj_id, user_id, role \\ "team") do
    attrs = %{project_id: proj_id, user_id: user_id, role: role}

    %Member{}
    |> Member.changeset(attrs)
    |> Member.validate
    |> Member.validate_duplicated
    |> Repo.insert
  end

  def update_member(%Member{} = member, attrs) do
    member
    |> Member.changeset(attrs)
    |> Member.validate
    |> Repo.update
  end

  def delete_member(proj_id, user_id) do
    with {:ok, member} <- get_member(proj_id, user_id) do
      Repo.delete(member)
    end
  end

  def member?(proj_id, user_id) do
    query =
      from m in Member,
      where: m.project_id == ^proj_id and
             m.user_id == ^user_id,
      select: count(m.id)

    Repo.one!(query) > 0
  end
end
