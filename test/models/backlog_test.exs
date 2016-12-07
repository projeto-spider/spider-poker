defmodule Poker.BacklogTest do
  use Poker.ModelCase

  alias Poker.Backlog

  @valid_attrs %{content: "some content", position: 42, priority: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Backlog.create_changeset(%Backlog{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Backlog.create_changeset(%Backlog{}, @invalid_attrs)
    refute changeset.valid?
  end
end
