defmodule Poker.Repo do
  use Ecto.Repo, otp_app: :poker
  use Scrivener, page_size: 50

  def soft_get(queryable, id, opts \\ []) do
    case get(queryable, id, opts) do
      nil ->
        {:error, :not_found}
      schema ->
        {:ok, schema}
    end
  end

  def soft_get_by(queryable, clauses, opts \\ []) do
    case get_by(queryable, clauses, opts) do
      nil ->
        {:error, :not_found}
      schema ->
        {:ok, schema}
    end
  end
end
