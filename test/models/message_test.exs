defmodule Poker.MessageTest do
  use Poker.ModelCase

  alias Poker.Message

  @valid_attrs %{content: "some content", read: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Message.create_changeset(%Message{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Message.create_changeset(%Message{}, @invalid_attrs)
    refute changeset.valid?
  end
end
