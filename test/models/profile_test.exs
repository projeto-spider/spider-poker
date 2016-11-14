defmodule Poker.ProfileTest do
  use Poker.ModelCase

  alias Poker.Profile

  @valid_attrs %{bio: "some content", company: "some content", contact: "some content", location: "some content", name: "some content", url: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Profile.changeset(%Profile{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Profile.changeset(%Profile{}, @invalid_attrs)
    refute changeset.valid?
  end
end
