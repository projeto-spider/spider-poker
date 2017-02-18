defmodule Poker.Router do
  use Poker.Web, :router
  use Plug.ErrorHandler

  @non_rest [:new, :edit]

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

    resources "/users", UserController, except: @non_rest do
      resources "/relationships/profile", ProfileController,
        singleton: true,
        only: [:show, :update]
      resources "/relationships/messages", MessageController, only: [:index, :update]
    end
    resources "/organizations", OrganizationController, except: @non_rest do
      resources "/relationships/members", OrganizationMemberController, excepct: @non_rest
      resources "/relationships/projects", ProjectController, except: @non_rest
    end
    resources "/notifications", NotificationController, only: [:index, :update]
    resources "/messages", MessageController, only: [:create]
    resources "/projects", ProjectController, except: @non_rest

    get "/sessions", SessionController, :show
    post "/sessions", SessionController, :create
  end

  scope "/", Poker do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  defp handle_errors(conn, reason) do
    App.ErrorHandler.handle_errors conn, reason
  end
end
