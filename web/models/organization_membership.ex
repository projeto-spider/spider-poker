defmodule Poker.OrganizationMembership do
  use Poker.Web, :model

  schema "organizations_memberships" do
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
end
