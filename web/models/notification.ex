defmodule Poker.Notification do
  use Poker.Web, :model

  schema "notifications" do
    field :content, :string
    field :read, :boolean, default: false
    belongs_to :user, Poker.User

    timestamps()
  end

  # Changesets

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:read])
  end
end
