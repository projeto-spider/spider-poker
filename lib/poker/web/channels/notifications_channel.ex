defmodule Poker.Web.NotificationsChannel do
  @moduledoc false
  use Phoenix.Channel

  import ShorterMaps
  alias Poker.Accounts.User
  alias Poker.Projects
  alias Poker.Projects.Project

  def join(channel_topic, _params, socket) do
    case socket.assigns.user do
      %User{} = user ->
        if (id(channel_topic) == user.id) do
          {:ok, socket}
        else
          {:error, %{reason: "unauthorized"}}
        end

      _ ->
        {:error, %{reason: "unauthorized"}}
    end
  end

  defp id("notifications:" <> str_id) do
    String.to_integer(str_id)
  end
end
