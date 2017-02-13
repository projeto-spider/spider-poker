defmodule Poker.OrganizationMemberTest do
  use Poker.ModelCase

  alias Poker.OrganizationMember

  @valid_attrs %{role: "owner"}
  @invalid_attrs %{role: "dummy"}

  test "changeset with valid attributes" do
    changeset = OrganizationMember.registration_changeset(%OrganizationMember{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = OrganizationMember.registration_changeset(%OrganizationMember{}, @invalid_attrs)
    refute changeset.valid?
  end
end
