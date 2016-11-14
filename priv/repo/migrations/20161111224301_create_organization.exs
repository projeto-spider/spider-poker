defmodule Poker.Repo.Migrations.CreateOrganization do
  use Ecto.Migration

  def change do
    create table(:organizations) do
      add :name, :string
      add :display_name, :string
      add :description, :string
      add :company, :string
      add :location, :string
      add :url, :text
      add :private, :boolean, default: false, null: false

      timestamps()
    end
    create unique_index(:organizations, [:name])

  end
end
