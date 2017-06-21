defmodule Poker.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string
      add :display_name, :string
      add :description, :string
      add :backlog, {:array, :integer}, default: []
      add :votation_time, :integer, default: 3
      add :private, :boolean, default: false, null: false
      add :organization_id, references(:organizations, on_delete: :nothing)

      timestamps()
    end
    create unique_index(:projects, [:name])
    create index(:projects, [:organization_id])

  end
end
