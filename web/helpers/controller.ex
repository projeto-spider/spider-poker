defmodule Poker.Helpers.Controller do
  import Ecto.Query, only: [from: 2]

  def nested_resource(conn) do
    path_info = conn.path_info

    case Enum.fetch(path_info, 3) do
      {:ok, _value} ->
        path_info
        |> Enum.drop(1)
        |> Enum.take(2)
        |> List.to_tuple

      _ ->
        :none
    end
  end

  defmacro filterable_by(fields) do
    fields
    |> Enum.map(&generic_filter/1)
  end

  defp generic_filter(field) do
    quote do
      def filter(_conn, query, unquote(field), values)
      when is_list(values) do
        key = unquote(String.to_atom(field))

        from ref in query, where: field(ref, ^key) in ^values
      end

      def filter(_conn, query, unquote(field), value) do
        key = unquote(String.to_atom(field))

        from ref in query, where: field(ref, ^key) == ^value
      end
    end
  end

  defp generic_filter(query, conn, filterables, param_key, transform_query) do
    params = Map.get(conn, :params, %{})

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

  def filter_params(query, conn, filterables) do
    generic_filter(query, conn, filterables, "filter", fn query, key, value ->
      from(ref in query, where: field(ref, ^key) == ^value)
    end)
  end

  def search_params(query, conn, filterables) do
    generic_filter(query, conn, filterables, "search", fn query, key, value ->
      value = "%#{value}%"
      from(ref in query, where: ilike(field(ref, ^key), ^value))
    end)
  end
end
