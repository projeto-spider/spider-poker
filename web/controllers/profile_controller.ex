defmodule Poker.ProfileController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.Profile

  plug :preload_session when action in [:update]
  plug JaResource, only: [:show, :update]

  def record(conn, foo) do
    user_id = conn.params["user_id"]

    Profile
    |> where(user_id: ^user_id)
    |> Repo.one
  end
end
