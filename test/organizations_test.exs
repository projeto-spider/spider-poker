defmodule Poker.OrganizationsTest do
  use Poker.DataCase

  alias Poker.Accounts
  alias Poker.Organizations
  alias Poker.Organizations.Organization

  @create_attrs %{name: "foobar",
                  display_name: "Foobar Qux",
                  description: "Lorem Ipsum",
                  location: "Dolor sit",
                  private: false,
                  url: "https://example.com"}
  @update_attrs %{name: "foobar-updated",
                  display_name: "Foobar Updated",
                  description: "Lorem Updated",
                  location: "Dolor Updated",
                  private: true,
                  url: "https://example.com.br"}
  @invalid_attrs %{name: nil,
                   description: nil,
                   display_name: nil,
                   location: nil,
                   private: nil,
                   url: nil}
  @user_attrs %{username: "foobar",
                display_name: "Foobar Qux",
                email: "foobar@example.com",
                password: "foobar123",
                password_confirmation: "foobar123"}

  def fixture(:organization, attrs \\ @create_attrs) do
    {:ok, organization} = Organizations.create(attrs)
    organization
  end
  def user_fixture(attrs \\ @user_attrs) do
    {:ok, user} = Accounts.create(attrs)
    user
  end

  test "query/0 query all organizations" do
    org = fixture(:organization)
    query = Organizations.query()
    assert [%Organization{} = entry] = Repo.all(query)
    assert entry.id == org.id
  end

  test "query_public/0 query organizations where private == false" do
    org = fixture(:organization)
    attrs = %{@create_attrs | name: "other-org", private: true}
    fixture(:organization, attrs)
    query = Organizations.query_public()
    assert [%Organization{} = entry] = orgs = Repo.all(query)
    assert entry.id == org.id
    assert Enum.count(orgs) == 1
  end

  test "query_visible_to/1 query organizations that a user can see" do
    user = user_fixture()
    org = fixture(:organization, %{@create_attrs | private: true})

    query = Organizations.query_visible_to(nil)
    assert [] = Repo.all(query)

    query = Organizations.query_visible_to(user)
    assert [] = Repo.all(query)

    Organizations.add_member(org.id, user.id)
    query = Organizations.query_visible_to(user)
    assert [%Organization{} = entry] = Repo.all(query)
    assert entry.id == org.id
  end

  test "get/2 returns the organization with given id" do
    organization = fixture(:organization)
    assert Organizations.get(organization.id) == {:ok, organization}
  end

  test "create/1 with valid data creates a organization" do
    assert {:ok, %Organization{} = organization} = Organizations.create(@create_attrs)
    assert organization.name == @create_attrs.name
    assert organization.display_name == @create_attrs.display_name
    assert organization.description == @create_attrs.description
    assert organization.location == @create_attrs.location
    assert organization.private == @create_attrs.private
    assert organization.url == @create_attrs.url
  end

  test "create/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} = Organizations.create(@invalid_attrs)
  end

  test "create/1 with invalid name returns error changeset" do
    data = %{@create_attrs | name: "foo bar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Organizations.create(data)
    assert "has invalid format" in errors_on(changeset).name

    data = %{@create_attrs | name: "1foobar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Organizations.create(data)
    assert "has invalid format" in errors_on(changeset).name

    data = %{@create_attrs | name: "abc"}
    assert {:error, %Ecto.Changeset{} = changeset} = Organizations.create(data)
    assert "should be at least 6 character(s)" in errors_on(changeset).name

    hundred_letters = 1..100
                      |> Enum.map(fn _ -> "a" end)
                      |> Enum.join
    data = %{@create_attrs | name: hundred_letters}
    assert {:error, %Ecto.Changeset{} = changeset} = Organizations.create(data)
    assert "should be at most 64 character(s)" in errors_on(changeset).name
  end

  test "create/1 with duplicated name returns error changeset" do
    fixture(:organization, @create_attrs)
    assert {:error, %Ecto.Changeset{} = changeset} = Organizations.create(@create_attrs)
    assert "has already been taken" in errors_on(changeset).name
  end

  test "update/2 with valid data updates the organization" do
    organization = fixture(:organization)
    assert {:ok, organization} = Organizations.update(organization, @update_attrs)
    assert %Organization{} = organization
    assert organization.name == @update_attrs.name
    assert organization.display_name == @update_attrs.display_name
    assert organization.description == @update_attrs.description
    assert organization.location == @update_attrs.location
    assert organization.private == @update_attrs.private
    assert organization.url == @update_attrs.url
  end

  test "update/2 with invalid data returns error changeset" do
    organization = fixture(:organization)
    assert {:error, %Ecto.Changeset{}} = Organizations.update(organization, @invalid_attrs)
    assert {:ok, organization} == Organizations.get(organization.id)
  end

  test "delete/1 deletes the organization" do
    organization = fixture(:organization)
    assert {:ok, %Organization{}} = Organizations.delete(organization)
    assert {:error, :not_found} = Organizations.get(organization.id)
  end
end
