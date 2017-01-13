defmodule Poker.Project do
  use Poker.Web, :model

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :organization_id,
                                    :organization, :users, :inserted_at,
                                    :updated_at]}

  schema "projects" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :private, :boolean, default: false
    belongs_to :organization, Poker.Organization
    has_many :users, through: [:organization, :users]

    timestamps()
  end

  # Changesets

  def changeset(struct, params \\ %{}) do
    struct
    |> validate_length(:name, min: 6, max: 64)
    |> validate_format(:name, Helpers.username_regex)
    |> unique_constraint(:name)
  end

  # Changesets

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :display_name, :description, :private])
    |> validate_required([:name, :display_name, :description, :private])
  end
end
