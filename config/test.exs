use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :poker, Poker.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :poker, Poker.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "",
  database: "poker_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# Come On In
config :comeonin, :bcrypt_log_rounds, 4
config :comeonin, :pbkdf2_rounds, 1

# Guardian
config :guardian, Guardian,
  secret_key: "2K/%r$0d]wdwv6A9h938"
