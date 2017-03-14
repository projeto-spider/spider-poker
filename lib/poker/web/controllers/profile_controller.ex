defmodule Poker.Web.ProfileController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.Profile

  def show(conn, %{"user_id" => user_id}) do
    profile =
      Profile
      |> Repo.get_by!(user_id: user_id)

    render(conn, "show.json", data: profile)
  end

  def update(conn, %{"user_id" => user_id, "data" => params}) do
    profile = Repo.get_by!(Profile, user_id: user_id)
    changeset = Profile.changeset(profile, params)

    case Repo.update(changeset) do
      {:ok, profile} ->
        render(conn, "show.json", data: profile)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Poker.Web.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
