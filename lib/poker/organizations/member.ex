defmodule Poker.Organizations.Member do
  use Poker.Web, :model

  alias Poker.Repo
  alias Poker.Organizations
  alias Poker.Organizations.Member

  schema "organizations_members" do
    field :role, :string, default: "member"
    belongs_to :organization, Poker.Organizations.Organization
    belongs_to :user, Poker.Accounts.User

    timestamps()
  end

  def changeset(attrs) do
    %Member{}
    |> cast(attrs, [:role, :user_id, :organization_id])
  end

  def changeset(%Member{} = member, attrs) do
    member
    |> cast(attrs, [:role])
  end

  def validate(member) do
    member
    |> validate_required([:role, :user_id, :organization_id])
    |> validate_inclusion(:role, ["admin", "member"])
    |> assoc_constraint(:organization)
    |> assoc_constraint(:user)
  end

  def validate_duplicated(member) do
    user_id = get_change(member, :user_id)
    organization_id = get_change(member, :organization_id)

    if Organizations.member?(organization_id, user_id) do
      member
      |> add_error(:user_id, "already member")
    else
      member
    end
  end
end
