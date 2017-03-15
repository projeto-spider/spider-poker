defmodule Poker.Web.Policy do
  import Poker.Web.Helpers, only: [module_for_controller: 2]

  defmacro __using__(_opts) do
    quote do
      import Poker.Web.Policy
    end
  end

  def authorize!(conn, action, data \\ %{}) do
    unless authorize(conn, action, data) == :ok do
      raise "Unauthorized"
    end

    :ok
  end

  def authorize(conn, action, data \\ %{}) do
    controller = Phoenix.Controller.controller_module(conn)
    policy_module = data[:policy] || module_for_controller("Policy", controller)
    user = conn.assigns[:current_user]
    args = [user, action, data[:resource]]

    if apply(policy_module, :can?, args) do
      :ok
    else
      {:error, :unauthorized}
    end
  end
end
