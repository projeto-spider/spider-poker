defmodule App.Repo.Migrations.CreateApp.Accounts.User do
  use Ecto.Migration

  def change do
    create table(:accounts_users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :string
      add :name, :string
      add :password_hash, :string
      add :admin?, :boolean, default: false, null: false

      timestamps()
    end

    create unique_index(:accounts_users, [:email])
  end
end
