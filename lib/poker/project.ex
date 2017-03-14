defmodule Poker.Project do
  use Poker.Web, :model

  alias Poker.Helpers

  schema "projects" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :private, :boolean, default: false
    belongs_to :organization, Poker.Organization
    has_many :projects_members, Poker.ProjectMember, on_delete: :delete_all
    has_many :users, through: [:projects_members, :users]

    timestamps()
  end

  # Changesets

  def changeset(struct, params \\ %{}) do
    struct
    |> validate_length(:name, min: 6, max: 64)
    |> validate_format(:name, Helpers.username_regex)
    |> unique_constraint(:name)
  end

  def create_changeset(struct, params \\ %{}) do
    params = Map.update params, "display_name", params["name"], &(&1)

    struct
    |> cast(params, [:name, :display_name, :description, :private])
    |> put_assoc(:organization, params["organization"])
    |> validate_required([:name, :display_name, :private, :organization])
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:display_name, :description, :private])
    |> changeset(params)
  end

  # Query composers

  def where_is_public(query) do
    from proj in query,
      join: org in assoc(proj, :organization),
      where: org.private == false and proj.private == false
  end

  def where_user_can_see(query, user_id) do
    from proj in query,
      join: org in assoc(proj, :organization),
      join: org_user in assoc(org, :organizations_members),
      join: proj_user in assoc(proj, :projects_members),
      where: (org.private == false and proj.private == false) or
             (org_user.user_id == ^user_id and proj_user.user_id == ^user_id)
  end
end
