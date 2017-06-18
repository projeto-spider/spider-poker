defmodule Poker.Projects.Backlog do
  @moduledoc false

  def unshift(backlog, id) do
    [id | backlog]
  end

  def push(backlog, id) do
    Enum.concat(backlog, [id])
  end

  def move(backlog, id, 0),    do: [id | Enum.reject(backlog, &(&1 == id))]
  def move([], id, _position), do: [id]
  def move([head|tail], id, position) do
    if head == id do
      move(tail, id, position)
    else
      [head | move(tail, id, position - 1)]
    end
  end
end
