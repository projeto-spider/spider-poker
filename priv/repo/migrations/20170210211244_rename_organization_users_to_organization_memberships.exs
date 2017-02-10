defmodule Poker.Repo.Migrations.RenameOrganizationUsersToOrganizationMemberships do
  use Ecto.Migration

  def change do
    rename table(:organizations_users), to: table(:organizations_memberships)
  end
end
