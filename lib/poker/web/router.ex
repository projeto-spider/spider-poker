defmodule Poker.Web.Router do
  use Poker.Web, :router

  @non_rest [:new, :edit]

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
    plug PreloadSession
  end

  scope "/api", Poker.Web do
    pipe_through :api

    resources "/users", UserController, except: @non_rest do
      resources "/profile", ProfileController,
        singleton: true,
        only: [:show, :update]
      resources "/messages", MessageController, only: [:index, :update]
      resources "/organizations", OrganizationController, except: @non_rest
      resources "/projects", ProjectController, except: @non_rest
    end
    resources "/organizations", OrganizationController, except: @non_rest do
      resources "/members", OrganizationMemberController, excepct: @non_rest,
                                                          as: "member"
      resources "/projects", ProjectController, except: @non_rest
    end
    resources "/notifications", NotificationController, only: [:index, :update]
    resources "/messages", MessageController, only: [:create]
    resources "/projects", ProjectController, except: @non_rest do
      resources "/members", ProjectMemberController, except: @non_rest, as: "member"
    end
    get "/projects/:id/backlog", ProjectController, :backlog

    get "/sessions", SessionController, :show
    post "/sessions", SessionController, :create
  end

  scope "/", Poker.Web do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  defp handle_errors(conn, reason) do
    Poker.Web.ErrorHandler.handle_errors conn, reason
  end
end
