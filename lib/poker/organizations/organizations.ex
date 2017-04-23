defmodule Poker.Organizations do
  @moduledoc false
  import Ecto.{Query, Changeset}, warn: false
  alias Poker.Repo
  alias Poker.Pattern
  alias Poker.Accounts.User
  alias Poker.Organizations.Organization
  alias Poker.Organizations.Member

  # Organization

  def query, do: Organization

  def query_public do
    Organization
    |> where(private: false)
  end

  def query_visible_to(%User{id: user_id}) do
    from o in Organization,
    left_join: m in assoc(o, :organizations_members),
    where: o.private == false or
           m.user_id == ^user_id
  end
  def query_visible_to(_), do: query_public()

  def get(scope \\ Organization, id) do
    if Pattern.numeric?(id) do
      Repo.soft_get(scope, id)
    else
      Repo.soft_get_by(Organization, name: id)
    end
  end

  def create(attrs \\ %{}) do
    %Organization{}
    |> Organization.changeset(attrs)
    |> Organization.default_display_name
    |> Organization.validate
    |> Repo.insert
  end

  def update(%Organization{} = organization, attrs) do
    organization
    |> Organization.changeset(attrs)
    |> Organization.validate
    |> Repo.update()
  end

  def delete(%Organization{} = organization) do
    Repo.delete(organization)
  end

  def can_see?(org_id, user_id) do
    scope = if is_nil(user_id) do
      query_public()
    else
      query_visible_to(%User{id: user_id})
    end

    query =
      from(m in scope, select: count(m.id, :distinct))

    case Repo.soft_get(query, org_id) do
      {:ok, 1} ->
        :ok
      {:ok, _} ->
        {:error, :not_found}
    end
  end

  # Membership

  def query_members(org_name)
  when is_binary(org_name) do
    from m in Member,
    preload: [:user],
    join: o in assoc(m, :organization),
    where: o.name == ^org_name
  end
  def query_members(org_id) do
    Member
    |> preload([:user])
    |> where(organization_id: ^org_id)
  end

  def get_member(org_id, id) do
    query =
      Member
      |> preload([:user])

    if Pattern.numeric?(id) do
      Repo.soft_get_by(query, organization_id: org_id, user_id: id)
    else
      Repo.soft_get_by(query, organization_id: org_id, username: id)
    end
  end

  def add_member(org_id, user_id, role \\ "member") do
    attrs = %{organization_id: org_id, user_id: user_id, role: role}

    %Member{}
    |> Member.changeset(attrs)
    |> Member.validate
    |> Member.validate_duplicated
    |> Repo.insert
  end

  def update_member(%Member{} = member, attrs) do
    member
    |> Member.changeset(attrs)
    |> Member.validate
    |> Repo.update
  end

  def delete_member(org_id, user_id) do
    with {:ok, member} <- get_member(org_id, user_id) do
      Repo.delete(member)
    end
  end

  def member?(org_id, user_id) do
    query =
      from m in Member,
      where: m.organization_id == ^org_id and
             m.user_id         == ^user_id,
      select: count(m.id)

    Repo.one!(query) > 0
  end

  def admin?(org_id, user_id) do
    query =
      from m in Member,
      where: m.organization_id == ^org_id  and
             m.user_id         == ^user_id and
             m.role            == "admin",
      select: count(m.id)

    Repo.one!(query) > 0
  end
end
