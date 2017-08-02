defmodule App.Repo.Migrations.AddProjectsOrganizationField do
  use Ecto.Migration

  def change do
    alter table(:projects_projects) do
      add :organization, :string
    end
  end
end
