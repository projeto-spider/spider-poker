defmodule App.Projects do
  @moduledoc """
  The boundary for the Projects system.
  """

  import Ecto.Query, warn: false

  alias Ecto.Changeset
  alias App.Repo
  alias App.Accounts.User
  alias App.Projects.Project
  alias App.Projects.Member
  alias App.Projects.Story
  alias App.Projects.Game

  @doc """
  Returns the list of projects.

  ## Examples

      iex> list_projects()
      [%Project{}, ...]

  """
  def list_projects do
    Repo.all(Project)
  end

  @doc """
  List projects where user is member
  """
  def list_user_projects(user_id) do
    query =
      from p in Project,
      join: u in assoc(p, :users),
      where: u.id == ^user_id,
      select: p
    Repo.all(query)
  end

  @doc """
  Gets a single project.

  Raises `Ecto.NoResultsError` if the Project does not exist.

  ## Examples

      iex> get_project!(123)
      %Project{}

      iex> get_project!(456)
      ** (Ecto.NoResultsError)

  """
  def get_project!(id), do: Repo.get!(Project, id)

  @doc """
  Creates a project.

  ## Examples

      iex> create_project(%{field: value})
      {:ok, %Project{}}

      iex> create_project(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_project(attrs \\ %{}, %User{id: manager_id}) do
    key = if atom_keys?(attrs), do: :manager_id, else: "manager_id"
    attrs = Map.put(attrs, key, manager_id)

    operation =
      %Project{}
      |> Project.changeset(attrs)
      |> Repo.insert()

    with {:ok, %Project{} = project} <- operation do
      {:ok, %Member{}} = add_member(project.id, manager_id)
      {:ok, project}
    end
  end

  @doc """
  Updates a project.

  ## Examples

      iex> update_project(project, %{field: new_value})
      {:ok, %Project{}}

      iex> update_project(project, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_project(%Project{} = project, attrs) do
    project
    |> Project.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Project.

  ## Examples

      iex> delete_project(project)
      {:ok, %Project{}}

      iex> delete_project(project)
      {:error, %Ecto.Changeset{}}

  """
  def delete_project(%Project{} = project) do
    Repo.delete(project)
  end

  @doc """
  Returns the list of members.

  ## Examples

      iex> list_members(project_id)
      [%Member{}, ...]

  """
  def list_members(project_id) do
    query =
      from m in Member,
      where: m.project_id == ^project_id
    Repo.all(query)
  end

  @doc """
  Returns the list of members.

  ## Examples

      iex> list_members(project_id)
      [%Member{}, ...]

  """
  def list_users(project_id) do
    query =
      from m in Member,
      join: p in assoc(m, :project),
      join: u in assoc(m, :user),
      select: u,
      where: p.id == ^project_id
    Repo.all(query)
  end

  @doc """
  Get a Member for a given project

  ## Examples

      iex> get_member("proj_id", "user_id")
      {:ok, %Member{}}

      iex> get_member("proj_id", "not_member")
      :nil

  """
  def get_member!(project_id, user_id), do:
    Repo.get_by!(Member, project_id: project_id, user_id: user_id)

  @doc """
  Check if someone already is a member from given project.
  """
  def member?(%Project{id: project_id}, user), do: member?(project_id, user)
  def member?(project_id, %User{id: user_id}), do: member?(project_id, user_id)
  def member?(project_id, user_id) do
    query =
      from m in Member,
      join: p in assoc(m, :project),
      join: u in assoc(m, :user),
      where: p.id == ^project_id,
      where: u.id == ^user_id,
      select: count(m.id)
    Repo.one(query) == 1
  end

  @doc """
  Check if someone is manager from a project
  """
  def manager?(project, %User{id: user_id}), do: manager?(project, user_id)
  def manager?(%Project{manager_id: manager_id}, user_id), do: manager_id == user_id
  def manager?(project_id, user_id) do
    query =
      from m in Member,
      join: p in assoc(m, :project),
      where: m.project_id == ^project_id,
      where: m.user_id == ^user_id,
      where: p.manager_id == ^user_id,
      select: count(m.id)
    Repo.one(query) == 1
  end

  @doc """
  Add a Member to a project if it's isn't already one.

  ## Examples

      iex> add_member("proj_id", "user_id")
      {:ok, %Member{}}

      iex> add_member("proj_id", "already_member")
      {:error, :already_member}

  """
  def add_member(project_id, user_id) do
    if member?(project_id, user_id) do
      {:error, :already_member}
    else
      attrs = %{project_id: project_id, user_id: user_id}
      %Member{}
      |> Member.changeset(attrs)
      |> Repo.insert()
    end
  end

  @doc """
  Remove a Member.

  ## Examples

      iex> remove_member(member)
      {:ok, %Member{}}

      iex> remove_member(member)
      {:error, %Ecto.Changeset{}}

  """
  def remove_member(%Member{} = member) do
    Repo.delete(member)
  end

  @doc """
  Retreives the backlog of one Project

  ## Examples

      iex> backlog(project_id)
      [%Story{}]
  """
  def backlog(%Project{backlog: []}), do: []
  def backlog(%Project{id: project_id, backlog: backlog}) do
    stories =
      Story
      |> where(project_id: ^project_id)
      |> preload([:children])
      |> Repo.all()
    # stories =
    #   Story
    #   |> where(project_id: ^project_id)
    #   |> Repo.all()

    db = for %Story{id: id} = story <- stories, into: %{}, do: {id, story}

    for parent_id <- backlog do
      parent = db[parent_id]
      %{parent | children: Enum.map(parent.backlog, &(db[&1]))}
    end
  end

  @doc """
  Get a story by ID

  ## Examples

      iex> get_story!(1)
      {:ok, %Story{}}

      iex> get_story(-1)
      ** (Ecto.NoResultsError)
  """
  def get_story!(id), do: Repo.get!(Story, id)

  @doc """
  Add a story at the start of the backlog

  ## Examples

      iex> unshift_story(project, %{name: "foo"})
      {:ok, %Project{}, %Story{}}

      iex> unshift_story(story, %{name: "foo"})
      {:ok, %Story{}, %Story{}}
  """
  def unshift_story(%{backlog: backlog} = parent, attrs) do
    atom_keys? = atom_keys?(attrs)
    key_for_project_id = if atom_keys?, do: :project_id, else: "project_id"

    attrs = case parent do
      %Project{id: project_id} ->
        Map.put(attrs, key_for_project_id, project_id)

      %Story{id: parent_id, project_id: project_id} ->
        key_for_parent_id = if atom_keys?, do: :parent_id, else: "parent_id"

        attrs
        |> Map.put(key_for_project_id, project_id)
        |> Map.put(key_for_parent_id, parent_id)
    end

    operation =
      %Story{}
      |> Story.changeset(attrs)
      |> Repo.insert()

    with {:ok, %Story{} = story} <- operation do
      backlog = [story.id] ++ backlog
      changeset = Changeset.change(parent, backlog: backlog)
      {:ok, parent} = Repo.update(changeset)
      {:ok, parent, story}
    end
  end

  @doc """
  Moves a story from a backlog position to another

  ## Examples

      iex> move_story(%Project{}, story_id, position)
      {:ok, %Project{}}

      iex> move_story(%Story{}, child_id, position)
      {:ok, %Story{}}
  """
  def move_story(%{backlog: backlog} = parent, story_id, position) do
    backlog =
      backlog
      |> Enum.reject(&(&1 == story_id))
      |> List.insert_at(position, story_id)

    changeset = Changeset.change(parent, backlog: backlog)

    with {:ok, parent} <- Repo.update(changeset) do
      {:ok, parent}
    end
  end

  @doc """
  Update a story

  ## Examples

      iex> update_story(story, %{title: "foo"})
      {:ok, %Story{}}
  """
  def update_story(%Story{} = story, attrs \\ %{}) do
    story
    |> Story.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Story.

  ## Examples

      iex> delete_story(story)
      {:ok, %Story{}}

      iex> delete_story(story)
      {:error, %Ecto.Changeset{}}

  """
  def delete_story(%{backlog: backlog} = parent, %Story{} = story) do
    with {:ok, story} <- Repo.delete(story) do
      backlog = List.delete(backlog, story.id)
      changeset = Changeset.change(parent, backlog: backlog)

      {:ok, parent} = Repo.update(changeset)
      {:ok, parent, story}
    end
  end

  @doc """
  Gets a single game.

  Raises `Ecto.NoResultsError` if the Game does not exist.

  ## Examples

      iex> get_game!("some game id")
      %Game{}

      iex> get_game!("invalid")
      ** (Ecto.NoResultsError)

  """
  def get_game!(id), do: Repo.get!(Game, id)

  @doc """
  Creates a game.

  ## Examples

      iex> create_game(%Story{})
      {:ok, %Game{}}
  """
  def create_game(%Story{} = story) do
    %Game{story_id: story.id}
    |> Game.changeset(%{})
    |> Repo.insert()
  end

  @doc """
  Updates a game.

  ## Examples

      iex> update_game(game, %{field: new_value})
      {:ok, %Game{}}
  """
  def update_game(%Game{} = game, attrs) do
    game
    |> Game.changeset(attrs)
    |> Repo.update()
  end

  # You can't mix key types for ecto attrs so we should
  # check which one we will add
  defp atom_keys?(map) do
    map
    |> Map.keys
    |> List.first
    |> is_atom()
  end
end
