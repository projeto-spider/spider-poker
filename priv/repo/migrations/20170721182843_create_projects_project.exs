defmodule App.Repo.Migrations.CreateApp.Projects.Project do
  use Ecto.Migration

  def change do
    create table(:projects_projects, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string, null: false
      add :votation_time, :integer, default: 3
      add :backlog, {:array, :integer}, default: []
      add :po_id, references(:accounts_users, on_delete: :nilify_all, type: :binary_id)
      add :manager_id, references(:accounts_users, on_delete: :delete_all, type: :binary_id)

      timestamps()
    end

    create index(:projects_projects, [:po_id])
    create index(:projects_projects, [:manager_id])
  end
end
