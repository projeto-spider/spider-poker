defmodule Poker.AccountsTest do
  use Poker.DataCase

  alias Poker.Accounts
  alias Poker.Accounts.User

  @create_attrs %{username: "foobar",
                  display_name: "Foobar Qux",
                  email: "foobar@example.com",
                  password: "foobar123",
                  password_confirmation: "foobar123"}
  @update_attrs %{username: "foobar-updated",
                  display_name: "Foobar Updated",
                  email: "foobar-updated@example.com",
                  password: "foobar123456",
                  password_confirmation: "foobar123456",
                  bio: "lorem ipsum",
                  location: "dolor sit",
                  contact: "amet",
                  url: "http://example.com"}
  @invalid_attrs %{username: nil,
                   email: nil,
                   display_name: nil,
                   password: nil,
                   password_confirmation: nil}

  def fixture(:user, attrs \\ @create_attrs) do
    {:ok, user} = Accounts.create(attrs)
    user
  end

  test "query/0 query all users" do
    user = fixture(:user)
    query = Accounts.query()
    assert [%User{} = entry] = Repo.all(query)
    assert entry.id == user.id
  end

  test "get/1 returns the user with given id" do
    user = fixture(:user)
    {:ok, %User{} = got} = Accounts.get(user.id)
    assert got.id == user.id
  end

  test "create/1 with valid data creates a user" do
    assert {:ok, %User{} = user} = Accounts.create(@create_attrs)
    assert user.username == @create_attrs.username
    assert user.email == @create_attrs.email
    assert user.display_name == @create_attrs.display_name
    assert Comeonin.Bcrypt.checkpw(@create_attrs.password, user.password_hash)
  end

  test "create/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} = Accounts.create(@invalid_attrs)
  end

  test "create/1 with invalid username returns error changeset" do
    data = %{@create_attrs | username: "foo bar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "has invalid format" in errors_on(changeset).username

    data = %{@create_attrs | username: "1foobar"}
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "has invalid format" in errors_on(changeset).username

    data = %{@create_attrs | username: "abc"}
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "should be at least 6 character(s)" in errors_on(changeset).username

    hundred_letters = 1..100
                      |> Enum.map(fn _ -> "a" end)
                      |> Enum.join
    data = %{@create_attrs | username: hundred_letters}
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "should be at most 64 character(s)" in errors_on(changeset).username
  end

  test "create/1 with duplicated username returns error changeset" do
    fixture(:user, %{@create_attrs | email: "diobrando@example.com"})
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(@create_attrs)
    assert "has already been taken" in errors_on(changeset).username
  end

  test "create/1 with duplicated emails returns error changeset" do
    fixture(:user, %{@create_attrs | username: "kono-dio-da"})
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(@create_attrs)
    assert "has already been taken" in errors_on(changeset).email
  end

  test "create/1 without password_confirmation returns error changeset" do
    data = Map.delete(@create_attrs, :password_confirmation)
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "can't be blank" in errors_on(changeset).password_confirmation
  end

  test "create/1 with wrong password_confirmation returns error changeset" do
    data = Map.put(@create_attrs, :password_confirmation, "kono dio da")
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.create(data)
    assert "does not match confirmation" in errors_on(changeset).password_confirmation
  end

  test "update/2 with valid data updates the user" do
    user = fixture(:user)
    assert {:ok, %User{} = user} = Accounts.update(user, @update_attrs)
    assert user.username == @update_attrs.username
    assert user.email == @update_attrs.email
    assert user.display_name == @update_attrs.display_name
    assert user.bio == @update_attrs.bio
    assert user.location == @update_attrs.location
    assert user.contact == @update_attrs.contact
    assert user.url == @update_attrs.url
    assert Comeonin.Bcrypt.checkpw(@update_attrs.password, user.password_hash)
  end

  test "update/2 with invalid data returns error changeset" do
    user = fixture(:user)
    assert {:error, %Ecto.Changeset{}} = Accounts.update(user, @invalid_attrs)
    {:ok, got} = Accounts.get(user.id)
    assert got.id == user.id
  end

  test "update/1 with2 password but no confirmation returns error changeset" do
    user = fixture(:user)
    data = Map.delete(@update_attrs, :password_confirmation)
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.update(user, data)
    assert "can't be blank" in errors_on(changeset).password_confirmation
    refute Comeonin.Bcrypt.checkpw(data.password, user.password_hash)
  end

  test "update/1 with wrong password_confirmation returns error changeset" do
    user = fixture(:user)
    data = Map.put(@update_attrs, :password_confirmation, "kono dio da")
    assert {:error, %Ecto.Changeset{} = changeset} = Accounts.update(user, data)
    assert "does not match confirmation" in errors_on(changeset).password_confirmation
    refute Comeonin.Bcrypt.checkpw(data.password, user.password_hash)
  end

  test "update/1 doesn't need a password" do
    user = fixture(:user)
    data = Map.drop(@update_attrs, [:password, :password_confirmation])
    assert {:ok, %User{} = user} = Accounts.update(user, data)
    assert user.username == @update_attrs.username
    assert user.email == @update_attrs.email
    assert user.display_name == @update_attrs.display_name
  end

  test "delete/1 deletes the user" do
    user = fixture(:user)
    assert {:ok, %User{}} = Accounts.delete(user)
    assert {:error, :not_found} == Accounts.get(user.id)
  end
end
