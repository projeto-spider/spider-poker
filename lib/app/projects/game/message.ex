defmodule App.Projects.Game.Message do
  @moduledoc false
  @derive {Poison.Encoder, only: ~w(body user_id)a}

  use Ecto.Schema
  import Ecto.Changeset
  alias App.Projects.Game.Message


  schema "game_messages" do
    field :body, :string
    belongs_to :game, App.Projects.Game, type: Ecto.UUID
    belongs_to :user, App.Accounts.User, type: Ecto.UUID

    timestamps()
  end

  @doc false
  def changeset(%Message{} = message, attrs) do
    message
    |> cast(attrs, ~w(body game_id user_id)a)
    |> validate_required(~w(body game_id)a)
    |> foreign_key_constraint(:game)
    |> foreign_key_constraint(:user)
  end
end
