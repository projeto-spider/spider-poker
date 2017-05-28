defmodule Poker.Projects.Backlog do
  @moduledoc false

  def unshift(backlog, id) do
    [id | backlog]
  end

  def push(backlog, id) do
    Enum.concat(backlog, [id])
  end
end
