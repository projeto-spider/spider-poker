defmodule Poker.Projects.Member do
  @moduledoc false
  use Poker.Web, :model

  alias Poker.Projects
  alias Poker.Projects.Member

  schema "projects_members" do
    field :role, :string
    belongs_to :user, Poker.Accounts.User
    belongs_to :project, Poker.Projects.Project

    timestamps()
  end

  def changeset(%Member{} = member, attrs \\ %{}) do
    member
    |> cast(attrs, [:role, :user_id, :project_id])
  end

  def validate(member) do
    member
    |> validate_required([:role, :user_id, :project_id])
    |> validate_inclusion(:role, ["po", "manager", "team"])
    |> assoc_constraint(:project)
    |> assoc_constraint(:user)
  end

  def validate_duplicated(member) do
    user_id = get_change(member, :user_id)
    project_id = get_change(member, :project_id)

    if Projects.member?(project_id, user_id) do
      member
      |> add_error(:user_id, "already a member")
    else
      member
    end
  end
end
