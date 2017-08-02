defmodule App.Projects.Member do
  @moduledoc false
  @derive {Poison.Encoder, only: [:user_id, :project_id]}
  use Ecto.Schema
  import Ecto.Changeset
  alias App.Projects.Member

  schema "projects_members" do
    # somewhat type couldn't be infered so I'm gonna
    # just say that they are :binary_id on these
    belongs_to :user, App.Accounts.User, type: :binary_id
    belongs_to :project, App.Projects.Project, type: :binary_id

    timestamps()
  end

  @doc false
  def changeset(%Member{} = member, attrs) do
    member
    |> cast(attrs, ~w(project_id user_id)a)
    |> assoc_constraint(:user)
    |> assoc_constraint(:project)
    |> validate_required(~w(project_id user_id)a)
  end
end
