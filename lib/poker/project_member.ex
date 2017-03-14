defmodule Poker.ProjectMember do
  use Poker.Web, :model

  alias Poker.{Repo, ProjectMember}

  schema "projects_members" do
    field :role, :string
    belongs_to :user, Poker.User
    belongs_to :project, Poker.Project

    timestamps()
  end

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_required([:role])
    |> validate_inclusion(:role, ["po", "manager", "team"])
    |> foreign_key_constraint(:user_id)
  end

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:role, :user_id, :project_id])
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:role])
    |> changeset(params)
  end

  # Query composers

  def where_is_public(query) do
    from member in query,
      join: proj in assoc(member, :project),
      join: org in assoc(proj, :organization),
      where: org.private == false and proj.private == false
  end

  def where_user_can_see(query, user_id) do
    from member in query,
      join: proj in assoc(member, :project),
      join: org in assoc(proj, :organization),
      join: org_user in assoc(org, :organizations_members),
      join: proj_user in assoc(proj, :projects_members),
      where: (org.private == false and proj.private == false) or
             (org_user.user_id == ^user_id and proj_user.user_id == ^user_id)
  end

  def where_is_member(query, proj_id, user_id) do
    query
    |> where(user_id: ^user_id, project_id: ^proj_id)
  end

  def member?(proj_id, user_id) do
    count =
      ProjectMember
      |> where_is_member(proj_id, user_id)
      |> select([ref], count(ref.id))
      |> Repo.one!

    count > 0
  end
end
