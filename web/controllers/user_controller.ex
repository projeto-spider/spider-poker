defmodule Poker.UserController do
  use Poker.Web, :controller
  use JaResource

  alias Poker.User

  plug :preload_session when action in [:update, :delete]
  plug JaResource

  # Scope

  def records(conn) do
    scope conn, User
  end

  # Handlers

  def handle_create(_conn, attributes) do
    User.create_changeset %User{}, attributes
  end

  def handle_update(conn, user, attributes) do
    authorize! conn, user

    User.update_changeset user, attributes
  end

  def handle_delete(conn, user) do
    authorize! conn, user

    super conn, user
  end

  # Filters

  filterable_by ["id", "username"]
end
