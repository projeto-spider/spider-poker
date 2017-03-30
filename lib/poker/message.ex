defmodule Poker.Message do
  use Poker.Web, :model
  alias Poker.{Message, User, Repo}

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :from, :to,
                                    :to_user, :inserted_at, :updated_at]}

  schema "messages" do
    field :content, :string
    field :read, :boolean, default: false
    belongs_to :from_user, Poker.User, foreign_key: :from
    belongs_to :to_user, Poker.User, foreign_key: :to

    timestamps
  end

  # Query composers

  def with_from_user(query \\ Message) do
    from m in query, preload: [from_user: :profile]
  end

  # Changesets

  def create_changeset(params \\ %{}) do
    from_user = params["from_user"]
    to_user = Repo.get_by User, username: (Map.get params, "to_user", "")

    %Message{}
    |> cast(params, [:content])
    |> put_assoc(:from_user, from_user)
    |> ensure_to_user_exists(to_user)
    |> validate_required([:content, :from_user, :to_user])
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:read])
  end

  # Helpers

  defp ensure_to_user_exists(changeset, to_user) do
    case to_user do
      nil ->
        changeset
        |> add_error(:to_user, "target user doesn't exist.")
      user ->
        changeset
        |> put_assoc(:to_user, user)
    end
  end
end
