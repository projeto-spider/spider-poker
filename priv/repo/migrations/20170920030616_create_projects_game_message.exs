defmodule App.Repo.Migrations.CreateApp.Projects.Game.Message do
  use Ecto.Migration

  def change do
    create table(:game_messages) do
      add :body, :string
      add :game_id, references(:games, on_delete: :delete_all, type: :binary_id)
      add :user_id, references(:accounts_users, on_delete: :delete_all, type: :binary_id)

      timestamps()
    end

    create index(:game_messages, [:game_id])
    create index(:game_messages, [:user_id])
  end
end
