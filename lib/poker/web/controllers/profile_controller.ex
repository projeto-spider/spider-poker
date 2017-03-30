defmodule Poker.Web.ProfileController do
  use Poker.Web, :controller
  alias Poker.Profile

  def show(conn, %{"user_id" => user_id}) do
    with profile <- Repo.one!(scope(conn)) do
      render(conn, "show.json", data: profile)
    end
  end

  def update(conn, %{"user_id" => user_id, "data" => params}) do
    with profile        <- Repo.one!(scope(conn)),
         :ok            <- authorize(conn, :update, %{user_id: profile.user_id}),
         changeset      <- Profile.changeset(profile, params),
         {:ok, profile} <- Repo.update(changeset)
    do
      render(conn, "show.json", data: profile)
    end
  end
end
