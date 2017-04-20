defmodule Poker.Query do
  @moduledoc false
  import Ecto.Query, only: [from: 2]

  def filter_params(query, params, filterables) do
    generic_filter(query, params, filterables, "filter", fn query, key, value ->
      from(ref in query, where: field(ref, ^key) == ^value)
    end)
  end

  def search_params(query, params, filterables) do
    generic_filter(query, params, filterables, "search", fn query, key, value ->
      value = "%#{value}%"
      from(ref in query, where: ilike(field(ref, ^key), ^value))
    end)
  end

  defp generic_filter(query, params, filterables, param_key, transform_query) do
    keys =
      params
      |> Map.get(param_key, %{})
      |> Map.keys
      |> Enum.filter(fn key -> key in filterables end)

    Enum.reduce(keys, query, fn key, query ->
      key_atom = String.to_atom(key)
      value = params[param_key][key]

      transform_query.(query, key_atom, value)
    end)
  end
end
