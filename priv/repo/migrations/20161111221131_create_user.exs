defmodule Poker.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string
      add :email, :string
      add :password_hash, :string
      add :display_name, :string
      add :bio, :string
      add :location, :string
      add :contact, :string
      add :url, :text
      add :admin?, :boolean, default: false

      timestamps()
    end
    create unique_index(:users, [:username])
    create unique_index(:users, [:email])

  end
end
