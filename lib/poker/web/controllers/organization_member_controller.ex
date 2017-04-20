defmodule Poker.Web.OrganizationMemberController do
  use Poker.Web, :controller

  alias Poker.Organizations
  alias Poker.Accounts

  def index(conn, ~m{organization_id} = params) do
    user_id = Session.user_id!(conn)

    with :ok <- Organizations.can_see?(organization_id, user_id) do
      page =
        conn
        |> scope
        |> Repo.paginate(params)

      render(conn, "index.json", page: page)
    end
  end

  def create(conn, ~m{data} = params) do
    with {:ok, org_id}       <- Param.fetch(params, "organization_id"),
         {:ok, user_id}      <- Param.fetch(data, "user_id"),
         role                <- Map.get(data, "role", "member"),
         {:ok, session_user} <- Session.user(conn),
         true                <- Organizations.admin?(org_id, session_user.id),
         {:ok, user}         <- Accounts.get(user_id),
         {:ok, membership}   <- Organizations.add_member(org_id, user_id, role)
    do
      conn
      |> put_status(:created)
      |> render("show.json", data: %{membership | user: user})
    end
  end

  def show(conn, ~m{organization_id, id}) do
    user_id = Session.user_id!(conn)
    with :ok               <- Organizations.can_see?(organization_id, user_id),
         {:ok, membership} <- Organizations.get_member(organization_id, id)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def update(conn, ~m{organization_id, id, data}) do
    with {:ok, session_user} <- Session.user(conn),
         true                <- Organizations.admin?(organization_id, session_user.id),
         {:ok, _user}        <- Accounts.get(id),
         {:ok, membership}   <- Organizations.get_member(organization_id, id),
         {:ok, membership}   <- Organizations.update_member(membership, data)
    do
      render(conn, "show.json", data: membership)
    end
  end

  def delete(conn, ~m{organization_id, id}) do
    with {:ok, session_user} <- Session.user(conn),
         true                <- Organizations.admin?(organization_id, session_user.id),
         {:ok, _membership}  <- Organizations.delete_member(organization_id, id)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
