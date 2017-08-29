defmodule App.Repo.Migrations.AddSocialAuthFields do
  use Ecto.Migration

  def change do
    alter table(:accounts_users) do
      add :auth_provider, :integer, default: 0
      add :auth_id, :string, default: ""
      add :avatar, :string, default: ""
    end
  end
end
