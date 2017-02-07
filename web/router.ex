defmodule Poker.Router do
  use Poker.Web, :router
  use Plug.ErrorHandler

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json-api"]
    plug JaSerializer.ContentTypeNegotiation
    plug JaSerializer.Deserializer
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/api", Poker do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit] do
      resources "/relationships/profile", ProfileController,
        singleton: true,
        only: [:show, :update]
      resources "/relationships/messages", MessageController, only: [:index, :update]
    end
    resources "/notifications", NotificationController, only: [:index, :update]
    resources "/messages", MessageController, only: [:create]
    resources "/organizations", OrganizationController, except: [:new, :edit]
    resources "/projects", ProjectController, except: [:new, :edit]

    get "/sessions/me", SessionController, :me
    post "/sessions/create", SessionController, :create
  end

  scope "/", Poker do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  defp handle_errors(conn, %{reason: %Bodyguard.NotAuthorizedError{}}) do
    send_resp conn, conn.status, ""
  end
  defp handle_errors(conn, _reason) do
    send_resp conn, conn.status, ""
  end
end
