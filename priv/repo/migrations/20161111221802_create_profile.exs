defmodule Poker.Repo.Migrations.CreateProfile do
  use Ecto.Migration

  def change do
    create table(:profiles) do
      add :name, :string
      add :bio, :string
      add :location, :string
      add :company, :string
      add :contact, :string
      add :url, :text
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps()
    end
    create index(:profiles, [:user_id])

  end
end
