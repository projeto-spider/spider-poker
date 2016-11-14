defmodule Poker.OrganizationTest do
  use Poker.ModelCase

  alias Poker.Organization

  @valid_attrs %{company: "some content", description: "some content", display_name: "some content", location: "some content", name: "some content", private: true, url: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Organization.changeset(%Organization{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Organization.changeset(%Organization{}, @invalid_attrs)
    refute changeset.valid?
  end
end
