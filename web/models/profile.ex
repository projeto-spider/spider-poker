defmodule Poker.Profile do
  use Poker.Web, :model

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :user, :id,
                                    :user_id, :inserted_at, :updated_at]}

  schema "profiles" do
    field :name, :string
    field :bio, :string
    field :location, :string
    field :contact, :string
    field :url, :string
    belongs_to :user, Poker.User

    timestamps()
  end

  # Changesets

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :bio, :location, :company, :contact, :url])
    |> validate_required([:name])
  end
end
