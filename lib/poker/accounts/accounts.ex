defmodule Poker.Accounts do
  @moduledoc false
  import Ecto.{Query, Changeset}, warn: false
  alias Poker.Repo
  alias Poker.Accounts.User

  def query, do: User

  def get(id) do
    if is_integer(id) or id =~ ~r{^[0-9]+$} do
      Repo.soft_get(User, id)
    else
      Repo.soft_get_by(User, username: id)
    end
  end

  def get_by(params), do: Repo.soft_get_by(User, params)

  def create(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> User.default_display_name
    |> User.put_password_hash
    |> User.validate
    |> validate_required([:password])
    |> Repo.insert
  end

  def update(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> User.put_password_hash
    |> User.validate
    |> Repo.update
  end

  def grant_admin(%User{} = user) do
    update_role(user, :grant)
  end

  def revoke_admin(%User{} = user) do
    update_role(user, :revoke)
  end

  def delete(%User{} = user) do
    Repo.delete(user)
  end

  defp update_role(%User{} = user, to) do
    user
    |> User.role_changeset(%{admin?: to == :grant})
    |> User.validate
    |> Repo.update
  end
end
