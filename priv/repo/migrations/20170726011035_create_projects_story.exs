defmodule App.Repo.Migrations.CreateApp.Projects.Story do
  use Ecto.Migration

  def change do
    create table(:stories) do
      add :title, :string
      add :description, :string
      add :estimation, :integer
      add :backlog, {:array, :integer}, default: []
      add :project_id, references(:projects_projects, on_delete: :delete_all, type: :binary_id)
      add :parent_id, references(:stories, on_delete: :delete_all)

      timestamps()
    end

    create index(:stories, [:project_id])
    create index(:stories, [:parent_id])
  end
end
