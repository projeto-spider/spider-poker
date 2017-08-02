defmodule App.Repo.Migrations.CreateApp.Projects.Game do
  use Ecto.Migration

  def change do
    create table(:games, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :state, :integer
      add :votes, :map
      add :story_id, references(:stories, on_delete: :delete_all)
      add :voting_start, :utc_datetime
      add :voting_end, :utc_datetime

      timestamps()
    end

    create index(:games, [:story_id])
  end
end
