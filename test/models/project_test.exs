defmodule Poker.ProjectTest do
  use Poker.ModelCase

  alias Poker.Project

  @valid_attrs %{description: "some content", display_name: "some content", name: "some content", private: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Project.changeset(%Project{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Project.changeset(%Project{}, @invalid_attrs)
    refute changeset.valid?
  end
end
