defmodule Poker.Web.Helpers.Controller do
  import Ecto.Query, only: [from: 2]
  import Phoenix.Controller, only: [scrub_params: 2]

  def flatten_param(conn, key) do
    conn
    |> scrub_params(key)
    |> Map.update!(:params, fn params ->
      Map.fetch!(params, key)
    end)
  end

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

  def paginate(query, params) do
    query
    |> Poker.Repo.paginate(params)
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
