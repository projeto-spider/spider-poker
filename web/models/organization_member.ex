defmodule Poker.OrganizationMember do
  use Poker.Web, :model

  alias Poker.{Repo, OrganizationMember}

  schema "organizations_members" do
    field :role, :string
    belongs_to :organization, Poker.Organization
    belongs_to :user, Poker.User

    timestamps()
  end

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_required([:role])
    |> validate_inclusion(:role, ["admin", "member"])
  end

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:role, :user_id, :organization_id])
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:role])
    |> changeset(params)
  end

  # Query composers

  def where_is_member(query, org_id, user_id) do
    query
    |> where(user_id: ^user_id, organization_id: ^org_id)
  end

  def member?(org_id, user_id) do
    count =
      OrganizationMember
      |> where_is_member(org_id, user_id)
      |> select([ref], count(ref.id))
      |> Repo.one!

    count > 0
  end

  def admin?(org_id, user_id) do
    count =
      OrganizationMember
      |> where_is_member(org_id, user_id)
      |> where(role: "admin")
      |> select([ref], count(ref.id))
      |> Repo.one!

    count > 0
  end
end
