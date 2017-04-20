defmodule Poker.Web.Helpers.Param do
  @moduledoc false

  def fetch(map, key) do
    case Map.fetch(map, key) do
      {:ok, value} ->
        {:ok, value}
      _ ->
        {:error, :bad_request}
    end
  end
end
