defmodule Poker.Repo.Migrations.CreateMessage do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :content, :text
      add :read, :boolean, default: false, null: false
      add :from, references(:users, on_delete: :nothing)
      add :to, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:messages, [:from])
    create index(:messages, [:to])

  end
end
