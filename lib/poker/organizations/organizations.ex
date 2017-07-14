defmodule Poker.Organizations do
  @moduledoc false
  import Ecto.{Query, Changeset}, warn: false
  alias Poker.Web.Endpoint
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

  def query_visible_to(%User{admin?: true}) do
    Organization
  end
  def query_visible_to(%User{id: user_id}) do
    from o in Organization,
    distinct: o.id,
    left_join: m in assoc(o, :organizations_members),
    where: o.private == false or
           m.user_id == ^user_id
  end
  def query_visible_to(_), do: query_public()

  def get(scope \\ Organization, id) do
    if Pattern.numeric?(id) do
      Repo.soft_get(scope, id)
    else
      Repo.soft_get_by(scope, name: id)
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
    scope =
      if is_nil(user_id) do
        query_public()
      else
        query_visible_to(%User{id: user_id})
      end

    query =
      from(m in scope, select: m.id)

    with {:ok, _id} <- get(query, org_id), do: :ok
  end

  # Membership

  def query_members(org_id) do
    if Pattern.numeric?(org_id) do
      Member
      |> preload([:user])
      |> where(organization_id: ^org_id)
    else
      from m in Member,
      preload: [:user],
      join: o in assoc(m, :organization),
      where: o.name == ^org_id
    end
  end

  def get_member(org_id, id) do
    query = query_members(org_id)

    if Pattern.numeric?(id) do
      Repo.soft_get_by(query, user_id: id)
    else
      query =
        from m in query,
        join: u in assoc(m, :user),
        where: u.username == ^id
      Repo.soft_one(query)
    end
  end

  def add_member(org_id, user_id, role \\ "member", opts \\ []) do
    notify? = Keyword.get(opts, :notify?, true)
    attrs = %{organization_id: org_id, user_id: user_id, role: role}

    operation =
      %Member{}
      |> Member.changeset(attrs)
      |> Member.validate
      |> Member.validate_duplicated
      |> Repo.insert

    if notify? do
      with {ok, member} <- operation do
        channel_name = "notifications:" <> Integer.to_string(member.user_id)
        Endpoint.broadcast! channel_name, "joined_organization", %{id: member.organization_id}

        operation
      end
    else
      operation
    end
  end

  def update_member(%Member{} = member, attrs) do
    member
    |> Member.changeset(attrs)
    |> Member.validate
    |> Repo.update
  end

  def delete_member(org_id, user_id, opts \\ []) do
    notify? = Keyword.get(opts, :notify?, true)

    with {:ok, member} <- get_member(org_id, user_id),
         operation     <- Repo.delete(member),
         {:ok, member} <- operation
    do
      if notify? do
        channel_name = "notifications:" <> Integer.to_string(member.user_id)
        Endpoint.broadcast! channel_name, "left_organization", %{id: member.organization_id}
      end

      operation
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
