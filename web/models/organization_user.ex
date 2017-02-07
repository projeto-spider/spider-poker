defmodule Poker.OrganizationUser do
  use Poker.Web, :model

  schema "organizations_users" do
    field :role, :string
    belongs_to :organization, Poker.Organization
    belongs_to :user, Poker.User

    timestamps()
  end

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_required([:role])
    |> validate_inclusion(:role, ["owner", "member"])
  end

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:role, :user_id, :organization_id])
    |> changeset(params)
  end
end
