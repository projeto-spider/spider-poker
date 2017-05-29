defmodule Poker.Web.Game do
  @moduledoc false
  use GenServer
  alias Poker.Web.Game
  alias Poker.Accounts.User
  alias Poker.Projects

  @state %{created: 0, idle: 1, voting: 2, discussion: 3}

  defstruct project_name: nil, state: @state.created,
            manager: nil, backlog: [], time: nil,
            current_story: nil, voted: []

  # Link

  def start_link() do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  # API

  def display_public(game) do
    game
    |> Map.take([:state, :time, :current_story, :voted])
  end

  def for(socket) do
    "game:" <> project_name = socket.topic
    fetch_or_create(project_name)
  end

  def fetch_or_create(project_name) do
    case fetch(project_name) do
      {:ok, game} ->
        {:ok, game}
      :error ->
        create(project_name)
    end
  end

  def create(project_name) do
    GenServer.call(__MODULE__, {:create, project_name})
  end

  def fetch(project_name) do
    GenServer.call(__MODULE__, {:fetch, project_name})
  end

  def exists?(project_name) do
    GenServer.call(__MODULE__, {:exists?, project_name})
  end

  def manager?(%Game{manager: manager}, %User{id: user_id}) do
    manager == user_id
  end

  def select_story(game, story_id) do
    GenServer.call(__MODULE__, {:select_story, game, story_id})
  end

  # Callbacks

  def handle_call({:create, project_name}, _from, state) do
    {:ok, project} = Projects.get(project_name)
    manager = Projects.get_manager(project.id)

    game = %Game{
      project_name: project_name,
      manager: manager.user_id,
      backlog: project.backlog
    }

    next_state = Map.put(state, project_name, game)

    {:reply, {:ok, game}, next_state}
  end

  def handle_call({:fetch, project_name}, _from, state) do
    answer = Map.fetch(state, project_name)
    {:reply, answer, state}
  end

  def handle_call({:exists?, project_name}, _from, state) do
    answer = Map.has_key?(state, project_name)
    {:reply, answer, state}
  end

  def handle_call({:select_story, game, story_id}, _from, state) do
    updated_game = %Game{game | current_story: story_id}
    next_state = Map.put(state, game.project_name, updated_game)
    {:reply, {:ok, updated_game}, next_state}
  end
end
