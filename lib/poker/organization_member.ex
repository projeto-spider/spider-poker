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
    |> foreign_key_constraint(:user_id)
  end

  def create_changeset(params \\ %{}) do
    %OrganizationMember{}
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
    |> distinct(true)
  end

  def where_user_can_see(query, user_id) do
    from(
      m in query,
        join: org in assoc(m, :organization),
        join: org_user in assoc(org, :organizations_members),
        where: (org.private == false) or (org_user.user_id == ^user_id)
    )
  end

  def where_is_public(query) do
    from(
      m in query,
        join: org in assoc(m, :organization),
        join: org_user in assoc(org, :organizations_members),
        where: org.private == true
    )
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
