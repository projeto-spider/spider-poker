defmodule Poker.OrganizationUserTest do
  use Poker.ModelCase

  alias Poker.OrganizationUser

  @valid_attrs %{role: "owner"}
  @invalid_attrs %{role: "dummy"}

  test "changeset with valid attributes" do
    changeset = OrganizationUser.registration_changeset(%OrganizationUser{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = OrganizationUser.registration_changeset(%OrganizationUser{}, @invalid_attrs)
    refute changeset.valid?
  end
end
