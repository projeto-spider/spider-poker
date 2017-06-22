defmodule Poker.Projects.Project do
  @moduledoc false
  use Poker.Web, :model
  use Ecto.Schema

  alias Poker.Pattern
  alias Poker.Projects.Project

  schema "projects" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :backlog, {:array, :integer}, default: []
    field :votation_time, :integer, default: 3
    field :private, :boolean, default: true
    belongs_to :organization, Poker.Organizations.Organization
    has_many :projects_members, Poker.Projects.Member, on_delete: :delete_all
    has_many :projects_stories, Poker.Projects.Story, on_delete: :delete_all
    has_many :users, through: [:projects_members, :users]

    timestamps()
  end

  def changeset(%Project{} = project, attrs \\ %{}) do
    project
    |> cast(attrs, [:name, :display_name, :description, :private, :votation_time])
  end

  def validate(changeset) do
    changeset
    |> validate_required([:name, :display_name])
    |> validate_length(:name, min: 6, max: 64)
    |> validate_length(:display_name, min: 1)
    |> validate_format(:name, Pattern.username())
    |> unique_constraint(:name)
    |> assoc_constraint(:organization)
  end

  def default_display_name(changeset) do
    name         = get_change(changeset, :name)
    display_name = get_change(changeset, :display_name)

    case {name, display_name} do
      {name, nil} when is_binary(name) ->
        changeset
        |> put_change(:display_name, name)

      _ ->
        changeset
    end
  end

  def backlog_changeset(%Project{} = project, attrs \\ %{}) do
    project
    |> cast(attrs, [:backlog])
  end
end
