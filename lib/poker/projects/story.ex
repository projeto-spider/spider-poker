defmodule Poker.Projects.Story do
  @moduledoc false
  @derive {Poison.Encoder, only: [:id, :title, :description, :estimation, :backlog]}
  use Poker.Web, :model

  alias Poker.Projects.Story

  schema "stories" do
    field :title, :string
    field :description, :string
    field :estimation, :integer
    field :backlog, {:array, :integer}, default: []
    belongs_to :project, Poker.Projects.Project

    timestamps()
  end

  def changeset(%Story{} = story, attrs \\ %{}) do
    story
    |> cast(attrs, [:title, :description, :estimation, :project_id])
  end

  def backlog_changeset(%Story{} = project, attrs \\ %{}) do
    project
    |> cast(attrs, [:backlog])
  end

  def validate(story) do
    story
    |> validate_required([:title, :project_id])
    |> assoc_constraint(:project)
  end
end
