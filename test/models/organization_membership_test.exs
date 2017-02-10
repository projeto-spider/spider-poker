defmodule Poker.OrganizationMembershipTest do
  use Poker.ModelCase

  alias Poker.OrganizationMembership

  @valid_attrs %{role: "owner"}
  @invalid_attrs %{role: "dummy"}

  test "changeset with valid attributes" do
    changeset = OrganizationMembership.registration_changeset(%OrganizationMembership{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = OrganizationMembership.registration_changeset(%OrganizationMembership{}, @invalid_attrs)
    refute changeset.valid?
  end
end
