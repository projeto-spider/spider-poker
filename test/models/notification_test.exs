defmodule Poker.NotificationTest do
  use Poker.ModelCase

  alias Poker.Notification

  @valid_attrs %{read: true}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Notification.update_changeset(%Notification{}, @valid_attrs)
    assert changeset.valid?
  end
end
