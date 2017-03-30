defmodule Poker.Organization do
  use Poker.Web, :model

  alias Poker.Organization
  alias Poker.Web.Helpers

  schema "organizations" do
    field :name, :string
    field :display_name, :string
    field :description, :string
    field :location, :string
    field :url, :string
    field :private, :boolean, default: false
    has_many :projects, Poker.Project, on_delete: :delete_all
    has_many :organizations_members, Poker.OrganizationMember, on_delete: :delete_all
    has_many :users, through: [:organizations_members, :user]

    timestamps()
  end

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_length(:name, min: 6, max: 64)
    |> validate_format(:name, Helpers.username_regex)
    |> unique_constraint(:name)
  end

  def create_changeset(params \\ %{}) do
    params = if params["display_name"] do
      params
    else
      Map.put(params, "display_name", params["name"])
    end

    %Organization{}
    |> cast(params, [:name, :display_name, :description, :location, :url, :private])
    |> validate_required([:name, :display_name])
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:display_name, :description, :location, :url, :private])
    |> validate_required([:display_name])
  end

  # Query composers

  def where_user_is_admin(query, user_id) do
    from(
      org in query,
        join: org_user in assoc(org, :organizations_members),
        where: (org_user.user_id == ^user_id and org_user.role == "admin")
    )
    |> distinct(true)
  end

  def where_user_can_see(query, user_id) do
    from(
      org in query,
        join: org_user in assoc(org, :organizations_members),
        where: (org.private == false) or (org_user.user_id == ^user_id)
    )
    |> distinct(true)
  end
end
