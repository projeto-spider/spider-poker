defmodule App.Web.Router do
  use App.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin do
    plug Plugs.EnsureCurrentUserIsAdmin
  end

  scope "/", App.Web do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", App.Web do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    resources "/sessions", SessionController, only: [:create, :show], singleton: true
    resources "/projects", ProjectController, except: [:new, :edit] do
      get "/backlog", ProjectController, :backlog, as: "backlog"
      resources "/members", ProjectMemberController, only: [:index, :create, :delete],
                                                     as: "member"
    end
  end

  scope "/api/admin", App.Web do
    pipe_through :api
    pipe_through :admin

    resources "/users", Admin.UserController, only: [:update, :delete], as: "admin_user"
    resources "/projects", Admin.ProjectController, only: [:index, :show, :update, :delete], as: "admin_project" do
      resources "/members", Admin.ProjectMemberController, only: [:index, :create, :delete], as: "member"
    end
  end
end
