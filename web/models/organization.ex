defmodule Poker.Organization do
  use Poker.Web, :model

  schema "organizations" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :company, :string
    field :location, :string
    field :url, :string
    field :private, :boolean, default: false
    has_many :projects, Poker.Project

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :display_name, :description, :company, :location, :url, :private])
    |> validate_required([:name, :display_name, :description, :company, :location, :url, :private])
    |> unique_constraint(:name)
  end
end
