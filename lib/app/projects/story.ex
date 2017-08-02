defmodule App.Projects.Story do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias App.Projects.Story

  schema "stories" do
    field :title, :string
    field :description, :string
    field :estimation, :integer
    field :backlog, {:array, :integer}, default: []
    belongs_to :parent, App.Projects.Story
    belongs_to :project, App.Projects.Project, type: :binary_id
    has_many :children, App.Projects.Story, foreign_key: :parent_id
    has_many :games, App.Projects.Game

    timestamps()
  end

  @doc false
  def changeset(%Story{} = story, attrs) do
    story
    |> cast(attrs, ~w(title description estimation project_id parent_id)a)
    |> assoc_constraint(:project)
    |> assoc_constraint(:parent)
    |> validate_required(~w(project_id title backlog)a)
  end

  defimpl Poison.Encoder, for: App.Projects.Story do
    def encode(attrs, options) do
      children = with %Ecto.Association.NotLoaded{} <- attrs.children, do: []

      prepared =
        attrs
        |> Map.take(~w(id title description estimation)a)
        |> Map.put(:children, children)

      Poison.Encoder.Map.encode(prepared, options)
    end
  end
end
