defmodule Poker.Projects.Backlog do
  @moduledoc false

  def unshift(backlog, id) do
    [id | backlog]
  end

  def push(backlog, id) do
    Enum.concat(backlog, [id])
  end

  def remove(backlog, id) do
    Enum.reject(backlog, &(&1 == id))
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

  def concat(backlog, others), do: Enum.concat(backlog, others)

  def insert_substories([], ids, _position), do: ids
  def insert_substories([head|tail], ids, parent_id) do
    if head == parent_id do
      [head | Enum.concat(ids, tail)]
    else
      [head | insert_substories(tail, ids, parent_id)]
    end
  end
end
