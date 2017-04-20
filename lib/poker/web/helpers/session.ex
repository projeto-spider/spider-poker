defmodule Poker.Web.Helpers.Session do
  @moduledoc false

  def user(conn) do
    case conn.assigns[:current_user] do
      nil ->
        {:error, :unauthorized}

      user ->
        {:ok, user}
    end
  end

  def user!(conn) do
    case user(conn) do
      {:error, _} ->
        nil
      {:ok, user} ->
        user
    end
  end

  def user_id!(conn) do
    case user(conn) do
      {:ok, user} ->
          user.id
      _ ->
        nil
    end
  end
end
