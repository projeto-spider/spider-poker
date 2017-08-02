defmodule App.Repo.Migrations.CreateApp.Projects.Member do
  use Ecto.Migration

  def change do
    create table(:projects_members) do
      add :user_id, references(:accounts_users, on_delete: :delete_all, type: :binary_id)
      add :project_id, references(:projects_projects, on_delete: :delete_all, type: :binary_id)

      timestamps()
    end

    create index(:projects_members, [:user_id])
    create index(:projects_members, [:project_id])
  end
end
