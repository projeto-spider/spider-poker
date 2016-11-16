defmodule Poker.Repo.Migrations.CreateOrganizationUser do
  use Ecto.Migration

  def change do
    create table(:organizations_users) do
      add :role, :string
      add :organization_id, references(:organizations, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:organizations_users, [:organization_id])
    create index(:organizations_users, [:user_id])

  end
end
