defmodule Poker.ProjectsTest do
  use Poker.DataCase

  alias Poker.Accounts
  alias Poker.Projects
  alias Poker.Projects.Project

  @create_attrs %{name: "foobar",
                  display_name: "Foobar Qux",
                  description: "Lorem ipsum dolor",
                  private: false}
  @update_attrs %{name: "foobar-updated",
                  display_name: "Foobar Updated",
                  description: "Lorem ipsum dolor updated",
                  private: true}
  @invalid_attrs %{name: nil,
                  display_name: nil,
                  description: nil,
                  private: nil}
  @user_attrs %{username: "foobar",
                display_name: "Foobar Qux",
                email: "foobar@example.com",
                password: "foobar123",
                password_confirmation: "foobar123"}


  def fixture(attrs \\ @create_attrs) do
    {:ok, project} = Projects.create(attrs)
    project
  end

  def user_fixture(attrs \\ @user_attrs) do
    {:ok, user} = Accounts.create(attrs)
    user
  end

  test "query/0 returns all projects" do
    project = fixture()
    query = Projects.query()
    assert [%Project{} = entry] = Repo.all(query)
    assert entry.id == project.id
  end

  test "query_public/0 query projects where private == false" do
    proj = fixture()
    attrs = %{@create_attrs | name: "other-proj", private: true}
    fixture(attrs)
    query = Projects.query_public()
    assert [%Project{} = entry] = projs = Repo.all(query)
    assert entry.id == proj.id
    assert Enum.count(projs) == 1
  end

  test "query_visible_to/1 query projects that a user can see" do
    user = user_fixture()
    proj = fixture(%{@create_attrs | private: true})

    query = Projects.query_visible_to(nil)
    assert [] = Repo.all(query)

    query = Projects.query_visible_to(user)
    assert [] = Repo.all(query)

    Projects.add_member(proj.id, user.id)
    query = Projects.query_visible_to(user)
    assert [%Project{} = entry] = Repo.all(query)
    assert entry.id == proj.id
  end

  test "get/2 returns the project with given id" do
    project = fixture()
    assert Projects.get(project.id) == {:ok, project}
  end

  test "create/1 with valid data creates a project" do
    assert {:ok, %Project{} = project} = Projects.create(@create_attrs)
    assert project.name == @create_attrs.name
    assert project.display_name == @create_attrs.display_name
    assert project.description == @create_attrs.description
    assert project.private == @create_attrs.private
  end

  test "create/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} = Projects.create(@invalid_attrs)
  end

  test "create/1 with invalid name returns error changeset" do
    data = %{@create_attrs | name: "foo bar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Projects.create(data)
    assert "has invalid format" in errors_on(changeset).name

    data = %{@create_attrs | name: "1foobar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Projects.create(data)
    assert "has invalid format" in errors_on(changeset).name

    data = %{@create_attrs | name: "abc"}
    assert {:error, %Ecto.Changeset{} = changeset} = Projects.create(data)
    assert "should be at least 6 character(s)" in errors_on(changeset).name

    hundred_letters = 1..100
                      |> Enum.map(fn _ -> "a" end)
                      |> Enum.join
    data = %{@create_attrs | name: hundred_letters}
    assert {:error, %Ecto.Changeset{} = changeset} = Projects.create(data)
    assert "should be at most 64 character(s)" in errors_on(changeset).name
  end

  test "create/1 with duplicated name returns error changeset" do
    fixture()
    assert {:error, %Ecto.Changeset{} = changeset} = Projects.create(@create_attrs)
    assert "has already been taken" in errors_on(changeset).name
  end

  test "update/2 with valid data updates the project" do
    project = fixture()
    assert {:ok, project} = Projects.update(project, @update_attrs)
    assert %Project{} = project
    assert project.name == @update_attrs.name
    assert project.display_name == @update_attrs.display_name
    assert project.description == @update_attrs.description
    assert project.private == @update_attrs.private
  end

  test "update/2 with invalid data returns error changeset" do
    project = fixture()
    assert {:error, %Ecto.Changeset{}} = Projects.update(project, @invalid_attrs)
    assert {:ok, project} == Projects.get(project.id)
  end

  test "delete/1 deletes the project" do
    project = fixture()
    assert {:ok, %Project{}} = Projects.delete(project)
    assert {:error, :not_found} = Projects.get(project.id)
  end
end
