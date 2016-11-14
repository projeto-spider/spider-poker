defmodule Poker.UserTest do
  use Poker.ModelCase

  alias Poker.User

  @valid_attrs %{username: "foobar", email: "foo@example.com",
                 password: "123456", password_confirmation: "123456",
                 profile: %{name: "Foo Username"}}

  test "registration validations" do
    changeset = User.registration_changeset(%User{}, @valid_attrs)
    assert changeset.valid?

    # Must confirm password
    fixture = Map.drop(@valid_attrs, [:password_confirmation])
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?

    # Automatically generate profile name
    fixture = Map.drop(@valid_attrs, [:profile])
    changeset = User.registration_changeset(%User{}, fixture)
    assert changeset.valid?
  end

  test "username size errors" do
    fixture = %{@valid_attrs | username: "four"}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?

    # 65 characters
    too_long = """
    1234567890123456789012345678901234567890123456789012345678901234
    """
    fixture = %{@valid_attrs | username: too_long}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?
  end

  test "invalid username format" do
    # Must start with a letter
    fixture = %{@valid_attrs | username: "1lubien"}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?

    # Must not contain blank spaces
    fixture = %{@valid_attrs | username: "lubien ferreira"}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?

    # Only letters, numbers, "_" and "-"
    fixture = %{@valid_attrs | username: "foo@bar"}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?
  end

  test "invalid email" do
    fixture = %{@valid_attrs | email: "foobar"}
    changeset = User.registration_changeset(%User{}, fixture)
    refute changeset.valid?
  end
end
