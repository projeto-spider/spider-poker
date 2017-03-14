defmodule Poker.Backlog do
  use Poker.Web, :model

  schema "backlogs" do
    field :content, :string
    field :position, :integer
    field :priority, :integer
    belongs_to :project, Poker.Project
    belongs_to :parent, Poker.Backlog, foreign_key: :parent_id

    timestamps
  end

  # Changesets

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content, :position, :priority])
    |> validate_required([:content, :position, :priority])
  end
end
