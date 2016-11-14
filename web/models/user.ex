defmodule Poker.User do
  use Poker.Web, :model

  alias Poker.User
  alias Poker.Profile
  import Comeonin.Bcrypt, only: [hashpwsalt: 1]

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :id, :password,
                                    :password_confirmation, :password_hash,
                                    :inserted_at, :updated_at]}

  @username_regex ~r{^([a-zA-Z])(\w|-)+$}
  @email_regex Regex.compile!("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}
  {\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|
  gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}
  \.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")

  schema "users" do
    field :username, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :password_hash, :string
    has_one :profile, Poker.Profile, on_replace: :update

    timestamps()
  end

  # Query composers

  def with_profile(query \\ User) do
    query
    |> preload([:profile])
  end

  # Changesets

  def changeset(struct, _params \\ %{}) do
    struct
    |> validate_length(:username, min: 6, max: 64)
    |> validate_length(:password, min: 6)
    |> validate_format(:username, @username_regex)
    |> validate_format(:email, @email_regex)
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end

  def registration_changeset(struct, params \\ %{}) do
    # Ensure the user will have a profile
    profile = if params["profile"] do
      # If provided, use it. It'll be validated by Profile.changeset/2
      params["profile"]
    else
      # Else use it's username
      %Profile{name: params["username"]}
    end

    struct
    # Cast the main fields
    |> cast(params, [:username, :email, :password, :password_confirmation])
    # Before casting, you need to put it's profile
    |> put_assoc(:profile, profile)
    # Cast it's profile association
    |> cast_assoc(:profile)
    # Now require all fields
    |> validate_required([:username, :email, :password, :password_confirmation,
                          :profile])
    # Require password_confirmation
    |> validate_confirmation(:password)
    # Hash the password
    |> put_password_hash
    # Default changeset validations
    |> changeset(params)
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    # Need to cast params first
    |> cast(params, [])
    # Let the profile changeset handle everything
    |> cast_assoc(:profile)
  end

  # Helpers

  defp put_password_hash(changeset) do
    case get_change(changeset, :password) do
      password when is_binary(password) ->
        changeset
        |> put_change(:password_hash, hashpwsalt(password))
      _ ->
        changeset
    end
  end
end
