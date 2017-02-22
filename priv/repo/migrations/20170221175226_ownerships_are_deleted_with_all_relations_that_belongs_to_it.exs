defmodule Poker.Repo.Migrations.OwnershipsAreDeletedWithAllRelationsThatBelongsToIt do
  use Ecto.Migration

  def change do
    # drop index(:projects, [:organization_id])
    # drop_if_exists index(:organizations_members, [:organization_id])
    # drop_if_exists index(:organizations_members, [:user_id])

    execute "ALTER TABLE projects DROP CONSTRAINT projects_organization_id_fkey"
    # execute "ALTER TABLE organizations_members DROP CONSTRAINT organizations_members_organization_id_fkey"
    # execute "ALTER TABLE organizations_members DROP CONSTRAINT organizations_members_user_id_fkey"

    alter table(:projects) do
      modify :organization_id, references(:organizations, on_delete: :delete_all)
    end

    alter table(:organizations_members) do
      modify :organization_id, references(:organizations, on_delete: :nothing)
      modify :user_id, references(:users, on_delete: :delete_all)
    end
  end
end
