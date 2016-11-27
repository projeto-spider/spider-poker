defmodule Poker.Notification do
  use Poker.Web, :model

  @derive {Poison.Encoder, except: [:__meta__, :__struct__, :user_id,
                                    :user, :inserted_at, :updated_at]}

  schema "notifications" do
    field :content, :string
    field :read, :boolean, default: false
    belongs_to :user, Poker.User

    timestamps()
  end

  # Query composers

  def from_user_id(query, user_id) do
    from n in query, where: n.user_id == ^user_id
  end

  # Changesets

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:read])
  end
end
