defmodule Poker.Web.Helpers.Scope do
  @moduledoc false

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
end
