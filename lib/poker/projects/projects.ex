defmodule Poker.Projects do
  @moduledoc false
  import Ecto.{Query, Changeset}, warn: false
  alias Poker.Repo
  alias Poker.Pattern
  alias Poker.Accounts.User
  alias Poker.Projects.Project
  alias Poker.Projects.Member
  alias Poker.Projects.Story
  alias Poker.Projects.Backlog

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
      from(m in scope, select: m.id)

    with {:ok, _id} <- get(query, proj_id), do: :ok
  end

  # Membership

  def query_members(proj_id) do
    if Pattern.numeric?(proj_id) do
      Member
      |> preload([:user])
      |> where(project_id: ^proj_id)
    else
      from m in Member,
      preload: [:user],
      join: p in assoc(m, :project),
      where: p.name == ^proj_id
    end
  end

  def get_member(proj_id, id) do
    query = query_members(proj_id)

    if Pattern.numeric?(id) do
      Repo.soft_get_by(query, user_id: id)
    else
      query =
        from m in query,
        join: u in assoc(m, :user),
        where: u.username == ^id
      Repo.soft_one(query)
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

  def manager?(proj_id, user_id) do
    query =
      from m in Member,
      where: m.project_id      == ^proj_id and
             m.user_id         == ^user_id and
             m.role            == "manager",
      select: count(m.id)

    Repo.one!(query) > 0
  end

  def get_manager(proj_id) do
    query =
      from m in Member,
      where: m.project_id == ^proj_id and
             m.role       == "manager"

    Repo.one(query)
  end

  # Backlog

  def query_stories(proj_id) do
    if Pattern.numeric?(proj_id) do
      Story
      |> where(project_id: ^proj_id)
    else
      from m in Story,
      join: p in assoc(m, :project),
      where: p.name == ^proj_id
    end
  end

  def add_story(proj_id, attrs \\ %{}) do
    attrs = Map.put(attrs, "project_id", proj_id)

    operation =
      %Story{}
      |> Story.changeset(attrs)
      |> Story.validate
      |> Repo.insert

    with {:ok, %Story{} = story} <- operation,
         {:ok, project}          <- get(proj_id),
          backlog                <- Backlog.unshift(project.backlog, story.id),
         {:ok, project}          <- project
                                    |> Project.backlog_changeset(%{"backlog" => backlog})
                                    |> Repo.update
    do
      {:ok, {backlog, story}}
    end
  end

  def update_story(id, attrs \\ %{}) do
    with {:ok, story} <- Repo.soft_get(Story, id),
         {:ok, story} <- story
                         |> Story.changeset(attrs)
                         |> Repo.update
    do
      {:ok, story}
    end
  end

  def delete_story(id) do
    with {:ok, story} <- Repo.soft_get(Story, id),
         {:ok, proj}  <- get(story.project_id),
         backlog      <- Backlog.remove(proj.backlog, id),
         {:ok, project} <- (proj
                           |> Project.backlog_changeset(%{"backlog" => backlog})
                           |> Repo.update),
         {:ok, story} <- Repo.delete(story)
    do
      {:ok, {backlog, story}}
    end
  end

  def move_story(proj_id, id, position) do
    with {:ok, project} <- get(proj_id),
          backlog       <- Backlog.move(project.backlog, id, position),
         {:ok, project} <- project
                           |> Project.backlog_changeset(%{"backlog" => backlog})
                           |> Repo.update
    do
      {:ok, project.backlog}
    end
  end
end
