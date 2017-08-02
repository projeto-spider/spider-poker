defmodule App.Accounts.User do
  @moduledoc false
  @derive {Poison.Encoder, only: ~w(id email name)a}
  use Ecto.Schema
  import Ecto.Changeset
  alias Ecto.Changeset
  alias App.Accounts.User
  alias Comeonin.Bcrypt

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "accounts_users" do
    field :admin?, :boolean, default: false
    field :email, :string
    field :name, :string
    field :password_hash, :string
    has_many :po_roles, App.Projects.Project, foreign_key: :po_id,
                                              on_delete: :nilify_all
    has_many :manager_roles, App.Projects.Project, foreign_key: :manager_id,
                                                   on_delete: :delete_all

    timestamps()
  end

  @doc false
  # Creation changeset
  def changeset(%User{id: nil} = user, attrs) do
    user
    |> cast(attrs, ~w(email name)a)
    |> require_password(attrs)
    |> put_password_hash(attrs)
    |> validate_required(~w(email name admin?)a)
    |> unique_constraint(:email)
  end
  # Update changeset
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, ~w(email name)a)
    |> put_password_hash(attrs)
    |> validate_required(~w(email name password_hash admin?)a)
    |> unique_constraint(:email)
  end
  # Admin panel Update changeset
  def full_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, ~w(email name admin?)a)
    |> put_password_hash(attrs)
    |> validate_required(~w(email name password_hash admin?)a)
    |> unique_constraint(:email)
  end

  # Small helper function to retreive a password
  # from either quoted or atom attrs
  defp fetch_password(attrs) do
    with :error <- Map.fetch(attrs, "password"),
         :error <- Map.fetch(attrs, :password) do
      :error
    end
  end

  # For the first time the changeset is used we
  # should ensure the password is set
  defp require_password(changeset, attrs) do
    case fetch_password(attrs) do
      :error -> add_error(changeset, :password, "can't be blank")
      _ -> changeset
    end
  end

  # Assuming a changeset is valid and a password was given in the attrs,
  # put a hashed password in the :password_hash field
  defp put_password_hash(%Changeset{valid?: true} = changeset, attrs) do
    case fetch_password(attrs) do
      {:ok, password} ->
        hash = Bcrypt.hashpwsalt(password)
        put_change(changeset, :password_hash, hash)

      :error ->
        changeset
    end
  end
  defp put_password_hash(changeset, _attrs) do
    changeset
  end
end
