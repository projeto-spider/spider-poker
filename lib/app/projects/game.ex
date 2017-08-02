defmodule App.Projects.Game do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias App.Projects.Game

  @state %{created: 0, idle: 1, voting: 2, discussion: 3}

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "games" do
    field :state, :integer, default: @state.created
    field :votes, :map, default: %{}
    field :voting_start, :utc_datetime
    field :voting_end, :utc_datetime
    belongs_to :story, App.Projects.Story, type: :integer

    timestamps()
  end

  @doc false
  def changeset(%Game{} = game, attrs) do
    game
    |> cast(attrs, ~w(state votes voting_start voting_end)a)
    |> validate_required(~w(state votes)a)
  end

  @doc false
  def state() do
    @state
  end

  defimpl Poison.Encoder, for: App.Projects.Game do
    def encode(attrs, options) do
      votes = if attrs.state == Game.state().voting do
        Map.keys(attrs.votes)
      else
        attrs.votes
      end

      prepared =
        attrs
        |> Map.take(~w(story_id state voting_start voting_end)a)
        |> Map.put(:votes, votes)

      Poison.Encoder.Map.encode(prepared, options)
    end
  end
end
