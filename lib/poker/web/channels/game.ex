defmodule Poker.Web.Game do
  @moduledoc false
  use GenServer
  alias Poker.Web.Game
  alias Poker.Accounts.User
  alias Poker.Projects

  @state %{created: 0, idle: 1, voting: 2, discussion: 3}

  defstruct project_name: nil, state: @state.created,
            manager: nil, scores: %{}, time: nil,
            current_story: nil, votes: %{}

  # Link

  def start_link() do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  # API

  def display_public(game) do
    payload =
      game
      |> Map.take([:state, :time, :current_story, :scores, :votes])

    if game.state == @state.voting do
      %{payload | votes: Map.keys(game.votes)}
    else
      payload
    end
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

  def start_voting(game, time_to_end) do
    GenServer.call(__MODULE__, {:start_voting, game, time_to_end})
  end

  def stop_voting(game) do
    GenServer.call(__MODULE__, {:stop_voting, game})
  end

  def set_vote(game, user_id, vote) do
    GenServer.call(__MODULE__, {:set_vote, game, user_id, vote})
  end

  def set_score(game,score) do
    GenServer.call(__MODULE__, {:set_score, game, score})
  end

  def finish(game) do
    GenServer.call(__MODULE__, {:finish, game})
  end

  # Callbacks

  def handle_call({:create, project_name}, _from, state) do
    {:ok, project} = Projects.get(project_name)
    manager = Projects.get_manager(project.id)

    scores =
      project.backlog
      |> Enum.map(fn id -> {id, nil} end)
      |> Enum.into(%{})

    game = %Game{
      project_name: project_name,
      manager: manager.user_id,
      scores: scores
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
    updated_game = %Game{game | state: @state.idle,
                                current_story: story_id}
    next_state = Map.put(state, game.project_name, updated_game)
    {:reply, {:ok, updated_game}, next_state}
  end

  def handle_call({:start_voting, game, time_to_end}, _from, state) do
    updated_game = %Game{game | state: @state.voting,
                                votes: %{},
                                time: time_to_end}
    next_state = Map.put(state, game.project_name, updated_game)
    {:reply, {:ok, updated_game}, next_state}
  end

  def handle_call({:stop_voting, game}, _from, state) do
    updated_game = %Game{game | state: @state.discussion,
                                time: System.system_time(:seconds)}
    next_state = Map.put(state, game.project_name, updated_game)
    {:reply, {:ok, updated_game}, next_state}
  end

  def handle_call({:set_vote, game, user_id, vote}, _from, state) do
    updated_votes =
      Map.update(game.votes, user_id, vote, fn _ -> vote end)

    updated_game = %Game{game | votes: updated_votes}
    next_state = Map.put(state, game.project_name, updated_game)
    {:reply, {:ok, updated_game}, next_state}
  end

  def handle_call({:set_score, game, score}, _from, state) do
    with {:ok, story} <- Projects.update_story(game.current_story, %{estimation: score}) do
      updated_scores =
        Map.update(game.scores, game.current_story, score, fn _ -> score end)

      updated_game = %Game{game | state: @state.idle,
                                  current_story: nil,
                                  votes: %{},
                                  time: nil,
                                  scores: updated_scores}
      next_state = Map.put(state, game.project_name, updated_game)

      {:reply, {:ok, {story, updated_game}}, next_state}
    end
  end

  def handle_call({:finish, game}, _from, state) do
    {:reply, {:ok, game}, Map.delete(state, game.project_name)}
  end
end
