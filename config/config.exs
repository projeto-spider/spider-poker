# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :poker,
  ecto_repos: [Poker.Repo]

# Configures the endpoint
config :poker, Poker.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "PtZux+4wH0tbKSqKRcMNHUhNd4K1IADslG5lnUTTlNeDLr0LWuebNJWjfA9uPWfF",
  render_errors: [view: Poker.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Poker.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Guardian
config :guardian, Guardian,
  issuer: "Poker",
  ttl: {30, :days},
  verify_issuer: true,
  serializer: Poker.GuardianSerializer

config :phoenix, :format_encoders,
  "json-api": Poison

config :mime, :types, %{
  "application/vnd.api+json" => ["json-api"]
}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
