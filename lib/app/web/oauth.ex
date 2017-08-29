defmodule App.Web.Oauth do
  import OAuth2.Client, warn: false

  alias App.Web.Oauth.GitHub
  alias App.Web.Oauth.Google
  alias App.Web.Oauth.Facebook

  def authorize_url!("github"), do: GitHub.authorize_url!(scope: "user:email")
  def authorize_url!("google"), do: Google.authorize_url!(scope: "https://www.googleapis.com/auth/userinfo.email")
  def authorize_url!("facebook"), do: Facebook.authorize_url!(scope: "public_profile,email")
  def authorize_url!(_), do: raise "No matching provider available"
  
  def get_token!("github", code), do: GitHub.get_token!(code: code)
  def get_token!("google", code), do: Google.get_token!(code: code)
  def get_token!("facebook", code), do: Facebook.get_token!(code: code)
  def get_token!(_, _), do: raise "No matching provider available"
  
  def get_user!("github", client) do
    %{body: user} = OAuth2.Client.get!(client, "/user")
    user
  end
  def get_user!("google", client) do
    %{body: user} = OAuth2.Client.get!(client, "https://www.googleapis.com/plus/v1/people/me/openIdConnect")
    user
  end
  def get_user!("facebook", client) do
    %{body: user} = OAuth2.Client.get!(client, "/me?fields=id,name,email,picture")
    user
  end
end