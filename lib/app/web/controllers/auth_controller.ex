defmodule App.Web.AuthController do
  use App.Web, :controller

  require App.Web.Oauth
  import App.Web.Oauth

  alias App.Web.Session

  @doc """
  This action is reached via `/auth/:provider` and redirects to the OAuth2 provider
  based on the chosen strategy.
  """
  def index(conn, %{"provider" => provider}) do
    redirect conn, external: authorize_url!(provider)
  end

  @doc """
  This action is reached via `/auth/:provider/callback` is the the callback URL that
  the OAuth2 provider will redirect the user back to with a `code` that will
  be used to request an access token. The access token will then be used to
  access protected resources on behalf of the user.
  """
  def callback(conn, %{"provider" => provider, "code" => code}) do
    client = get_token!(provider, code)
    user = get_user!(provider, client)

    with {:ok, token} <- Session.social_auth(provider, user) do
      conn
      |> redirect(to: "/#/auth/social/?token=#{token}")
    else
      {:error, %Ecto.Changeset{} = error} ->
        conn
        |> redirect(to: "/#/auth/social/?error=email_used")

      _ ->
        conn
        |> redirect(to: "/#/auth/social/?error=true")
    end
  end
end