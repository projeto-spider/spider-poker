defmodule Poker.Accounts.User do
  @moduledoc false
  use Poker.Web, :model

  alias Poker.Accounts.User
  alias Poker.Pattern

  schema "users" do
    field :username, :string
    field :display_name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :password_hash, :string
    field :bio, :string
    field :location, :string
    field :contact, :string
    field :url, :string
    has_many :organizations_users, Poker.Organizations.Member
    has_many :organizations, through: [:organizations_users, :organization]
    has_many :notifications, Poker.Notification, on_delete: :delete_all

    timestamps()
  end

  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:username, :email, :password, :password_confirmation, :bio,
                    :display_name, :location, :contact, :url])
  end

  def validate(changeset) do
    changeset
    |> validate_required([:username, :email, :display_name])
    |> validate_length(:username, min: 6, max: 64)
    |> validate_length(:display_name, min: 1)
    |> validate_length(:password, min: 6)
    |> validate_format(:username, Pattern.username())
    |> validate_format(:email, Pattern.email())
    |> validate_format(:url, Pattern.url())
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end

  def default_display_name(changeset) do
    username     = get_change(changeset, :username)
    display_name = get_change(changeset, :display_name)

    case {username, display_name} do
      {username, nil} when is_binary(username) ->
        changeset
        |> put_change(:display_name, username)

      _ ->
        changeset
    end
  end

  def put_password_hash(changeset) do
    case get_change(changeset, :password) do
      nil ->
        changeset

      password ->
        changeset
        |> put_change(:password_hash, Comeonin.Bcrypt.hashpwsalt(password))
        |> validate_required([:password_confirmation])
        |> validate_confirmation(:password, required: true)
    end
  end
end
