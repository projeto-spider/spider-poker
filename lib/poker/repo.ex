defmodule Poker.Repo do
  use Ecto.Repo, otp_app: :poker
  use Scrivener, page_size: 50
end
