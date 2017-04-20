defmodule Poker.Web.OrganizationController do
  use Poker.Web, :controller

  alias Poker.Accounts
  alias Poker.Organizations

  def index(conn, params) do
    page =
      conn
      |> scope
      |> Repo.paginate(params)

    render(conn, "index.json", page: page)
  end

  def create(conn, ~m{data}) do
    with :ok          <- authorize(conn, :create),
         {:ok, org}   <- Organizations.create(data),
         {:ok, admin} <- Session.user(conn),
         {:ok, _role} <- Organizations.add_member(org.id, admin.id, "admin")
    do
      conn
      |> put_status(:created)
      |> put_resp_header("location", organization_path(conn, :show, org))
      |> render("show.json", data: org)
    end
  end

  def show(conn, ~m{id}) do
    with {:ok, org} <- Organizations.get(scope(conn), id) do
      render(conn, "show.json", data: org)
    end
  end

  def update(conn, ~m{id, data}) do
    with {:ok, org} <- Organizations.get(scope(conn), id),
         :ok        <- authorize(conn, :update, %{organization: org}),
         {:ok, org} <- Organizations.update(org, data)
    do
      render(conn, "show.json", data: org)
    end
  end

  def delete(conn, ~m{id}) do
    with {:ok, org} <- Organizations.get(scope(conn), id),
         :ok        <- authorize(conn, :delete, %{organization: org}),
         {:ok, _}   <- Organizations.delete(org)
    do
      send_resp(conn, :no_content, "")
    end
  end
end
