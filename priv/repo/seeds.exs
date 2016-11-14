defmodule Poker.DatabaseSeeder do
  alias Poker.Repo
  alias Poker.User
  alias Poker.Profile

  def seed do
    users = [
      %{"username" => "administer", "email" => "admin@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "lubien", "email" => "lubien@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
      %{"username" => "foobar", "email" => "foo@example.com",
        "password" => "123456", "password_confirmation" => "123456"},
    ]

    users
    |> Enum.map(fn user ->
      User.registration_changeset(%User{}, user)
      |> Repo.insert!
    end)
  end

  def unseed do
    Repo.delete_all Profile
    Repo.delete_all User
  end
end
