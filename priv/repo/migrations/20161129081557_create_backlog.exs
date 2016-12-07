defmodule Poker.Repo.Migrations.CreateBacklog do
  use Ecto.Migration

  def change do
    create table(:backlogs) do
      add :content, :text
      add :position, :integer
      add :priority, :integer
      add :project_id, references(:projects, on_delete: :nothing)
      add :parent_id, references(:backlogs, on_delete: :nothing)

      timestamps()
    end
    create index(:backlogs, [:project_id])
    create index(:backlogs, [:parent_id])

  end
end
