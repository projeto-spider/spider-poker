defmodule Poker.Web.Policy.Profile do
  use Poker.Web, :policy

  alias Poker.{User, Profile}

  def can?(%User{id: user_id}, :update, %{user_id: profile_user_id}) do
    user_id == profile_user_id
  end
end
