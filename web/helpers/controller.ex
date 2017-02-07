defmodule Poker.Helpers.Controller do
  def nested_resource(conn) do
    path_info = conn.path_info

    case Enum.fetch(path_info, 3) do
      {:ok, "relationships"} ->
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
end
