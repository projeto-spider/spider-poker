defmodule Poker.Web.Helpers.Controller do
  @moduledoc false
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
end
