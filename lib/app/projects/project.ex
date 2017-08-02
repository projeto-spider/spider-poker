defmodule App.Projects.Project do
  @moduledoc false
  @derive {Poison.Encoder, only: ~w(id name organization current_game
                                    votation_time po_id manager_id)a}

  use Ecto.Schema
  import Ecto.Changeset
  alias App.Projects.Project

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "projects_projects" do
    field :name, :string
    field :organization, :string
    field :votation_time, :integer, default: 3
    field :backlog, {:array, :integer}, default: []
    field :current_game, Ecto.UUID
    belongs_to :po, App.Accounts.User
    belongs_to :manager, App.Accounts.User
    has_many :members, App.Projects.Member
    has_many :users, through: [:members, :user]

    timestamps()
  end

  @doc false
  def changeset(%Project{} = project, attrs) do
    project
    |> cast(attrs, ~w(name organization votation_time manager_id po_id current_game)a)
    |> foreign_key_constraint(:current_game)
    |> validate_required(~w(name votation_time backlog manager_id)a)
  end
end
