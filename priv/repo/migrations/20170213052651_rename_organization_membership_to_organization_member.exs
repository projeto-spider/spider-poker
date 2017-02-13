defmodule Poker.Repo.Migrations.RenameOrganizationMembershipToOrganizationMember do
  use Ecto.Migration

  def change do
    rename table(:organizations_memberships), to: table(:organizations_members)
  end
end
