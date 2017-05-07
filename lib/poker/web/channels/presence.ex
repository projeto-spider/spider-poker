defmodule Poker.Web.Presence do
  @moduledoc false
  use Phoenix.Presence, otp_app: :poker,
                        pubsub_server: Poker.PubSub
  alias Poker.Repo
  alias Poker.Accounts.User
  import Ecto.Query, only: [from: 2]

  def fetch(_topic, entries) do
    query =
      from u in User,
      where: u.id in ^Map.keys(entries),
      select: {u.id, u}

    users = query |> Repo.all |> Enum.into(%{})

    for {key, %{metas: metas}} <- entries, into: %{} do
      id = String.to_integer(key)
      {key, %{metas: metas, user: users[id]}}
    end
  end
end
