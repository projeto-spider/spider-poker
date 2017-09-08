defmodule App.Repo.Migrations.AddStorySourceField do
  use Ecto.Migration

  def change do
    alter table(:stories) do
      add :source, :integer, default: 0
    end
  end
end
