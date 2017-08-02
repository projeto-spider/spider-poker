defmodule App.Web.Admin.UserController do
  use App.Web, :controller

  alias App.Accounts
  alias App.Accounts.User
  alias App.Web.UserView

  def update(conn, %{"id" => id, "data" => user_params}) do
    user = Accounts.get_user!(id)

    with {:ok, %User{} = user} <- Accounts.full_update_user(user, user_params) do
      render(conn, UserView, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    with {:ok, %User{}} <- Accounts.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
