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

  # Query composers

  def visible(query \\ Project, org_name, user_id \\ 0) do
    from proj in query,
    join: user in assoc(proj, :users),
    join: org in assoc(proj, :organization),
    where: org.name == ^org_name,
    where: user.id == ^user_id or proj.private == false
  end

  # Changesets

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :display_name, :description, :private])
    |> validate_required([:name, :display_name, :description, :private])
  end
end
