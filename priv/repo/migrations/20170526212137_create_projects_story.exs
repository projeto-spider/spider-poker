defmodule Poker.Repo.Migrations.CreatePoker.Projects.Story do
  use Ecto.Migration

  def change do
    create table(:stories) do
      add :title, :string
      add :description, :string
      add :estimation, :integer
      add :project_id, references(:projects, on_delete: :delete_all)

      timestamps()
    end

    create index(:stories, [:project_id])
  end
end
