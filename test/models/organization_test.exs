defmodule Poker.OrganizationTest do
  use Poker.ModelCase

  alias Poker.Organization

  @valid_attrs %{"name" => "organization", "display_name" => "Organization"}

  test "changeset with valid attributes" do
    changeset = Organization.registration_changeset(%Organization{}, @valid_attrs)
    assert changeset.valid?
  end

  test "when display_name is empty, use it's name as display" do
    fixture = Map.drop(@valid_attrs, ["display_name"])
    changeset = Organization.registration_changeset(%Organization{}, fixture)
    assert changeset.valid?
  end

  test "empty changeset" do
    changeset = Organization.registration_changeset(%Organization{}, %{})
    refute changeset.valid?
  end
end
