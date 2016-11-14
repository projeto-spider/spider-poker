defmodule Poker.Project do
  use Poker.Web, :model

  schema "projects" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :private, :boolean, default: false
    belongs_to :organization, Poker.Organization

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :display_name, :description, :private])
    |> validate_required([:name, :display_name, :description, :private])
  end
end
