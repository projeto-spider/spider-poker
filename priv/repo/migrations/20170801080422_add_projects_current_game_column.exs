defmodule App.Repo.Migrations.AddProjectsCurrentGameColumn do
  use Ecto.Migration

  def change do
    alter table(:projects_projects) do
      add :current_game, references(:games, on_delete: :nilify_all, type: :binary_id)
    end

    create index(:projects_projects, [:current_game])
  end
end
