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

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_length(:name, min: 6, max: 64)
    |> unique_constraint(:name)
  end

  def registration_changeset(struct, params \\ %{}) do
    params = if params["display_name"] do
      params
    else
      Map.put(params, "display_name", params["name"])
    end

    struct
    |> cast(params, [:name, :display_name, :description, :company, :location, :url, :private])
    |> validate_required([:name, :display_name])
    |> changeset(params)
  end
end
