defmodule Poker.Organization do
  use Poker.Web, :model

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :id, :projects,
                                    :organizations_users, :users, :updated_at,
                                    :inserted_at]}


  schema "organizations" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :location, :string
    field :url, :string
    field :private, :boolean, default: false
    has_many :projects, Poker.Project
    has_many :organizations_users, Poker.OrganizationUser, on_delete: :delete_all
    has_many :users, through: [:organizations_users, :user]

    timestamps()
  end

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_length(:name, min: 6, max: 64)
    |> validate_format(:name, Helpers.username_regex)
    |> unique_constraint(:name)
  end

  def create_changeset(struct, params \\ %{}) do
    params = if params["display_name"] do
      params
    else
      Map.put(params, "display_name", params["name"])
    end

    struct
    |> cast(params, [:name, :display_name, :description, :location, :url, :private])
    |> validate_required([:name, :display_name])
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:display_name, :description, :location, :url, :private])
  end
end
