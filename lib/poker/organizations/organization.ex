defmodule Poker.Organizations.Organization do
  @moduledoc false
  use Poker.Web, :model
  use Ecto.Schema

  alias Poker.Pattern
  alias Poker.Organizations.Organization

  schema "organizations" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :location, :string
    field :url, :string
    field :private, :boolean, default: true
    has_many :projects, Poker.Projects.Project, on_delete: :delete_all
    has_many :organizations_members, Poker.Organizations.Member, on_delete: :delete_all
    has_many :users, through: [:organizations_members, :user]

    timestamps()
  end

  def changeset(%Organization{} = organization, attrs \\ %{}) do
    organization
    |> cast(attrs, [:name, :display_name, :description, :location, :url,
                    :private])
  end

  def validate(changeset) do
    changeset
    |> validate_required([:name, :display_name])
    |> validate_length(:name, min: 6, max: 64)
    |> validate_length(:display_name, min: 1)
    |> validate_format(:name, Pattern.username())
    |> validate_format(:url, Pattern.url())
    |> unique_constraint(:name)
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
end
