defmodule Poker.Web.Scope do
  @moduledoc false
  alias Phoenix.Controller
  import Poker.Web.Helpers, only: [module_for_controller: 2]

  defmacro __using__(_opts) do
    quote do
      import Poker.Web.Scope
    end
  end

  def scope(conn, data \\ %{}) do
    controller = Controller.controller_module(conn)
    scope_module = data[:scope] || module_for_controller("Scope", controller)
    user = conn.assigns[:current_user]
    action = data[:action] || Controller.action_name(conn)
    args = [conn, user, action, data]

    apply(scope_module, :scope, args)
  end
end
