defmodule Poker.Backlog do
  @moduledoc false
  use Poker.Web, :model

  alias Poker.Backlog

  schema "backlogs" do
    field :content, :string
    field :position, :integer
    field :priority, :integer
    belongs_to :project, Poker.Project
    belongs_to :parent, Poker.Backlog, foreign_key: :parent_id

    timestamps()
  end

  # Changesets

  def create_changeset(params \\ %{}) do
    %Backlog{}
    |> cast(params, [:content, :position, :priority])
    |> validate_required([:content, :position, :priority])
  end
end
