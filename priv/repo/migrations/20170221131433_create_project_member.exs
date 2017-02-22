defmodule Poker.Repo.Migrations.CreateProjectMember do
  use Ecto.Migration

  def change do
    create table(:projects_members) do
      add :role, :string
      add :project_id, references(:projects, on_delete: :delete_all)
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end
    create index(:projects_members, [:project_id])
    create index(:projects_members, [:user_id])

  end
end
