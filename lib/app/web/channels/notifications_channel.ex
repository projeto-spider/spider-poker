defmodule App.Web.NotificationsChannel do
  @moduledoc false
  use Phoenix.Channel

  def join("notifications:" <> user_id, _params, socket) do
    if user_id == user(socket).id do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  defp user(socket), do: socket.assigns.user
end
