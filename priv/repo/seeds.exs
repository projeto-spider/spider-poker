defmodule CLI do
  alias Poker.Seeder

  @parse_opts [
    strict: [
      seed: :boolean,
      unseed: :boolean
    ],
    aliases: [
      h: :help
    ]
  ]

  def init do
    System.argv
    |> OptionParser.parse(@parse_opts)
    |> process
  end

  defp process({[seed: true], _, _}) do
    Seeder.seed
  end
  defp process({[unseed: true], _, _}) do
    Seeder.unseed
  end
  defp process({_, _, _}) do
    IO.puts "Usage: mix run priv/repo/seeds.exs [--seed|--unseed]"
  end
end

defmodule Poker.Seeder do
  alias Poker.{Repo, User, Organization, OrganizationMember}

  def seed do
    users = [
      user_factory("administer"),
      user_factory("lubien", "lubien1996@gmail.com"),
      user_factory("leochrisis", "leonardo.chfc@gmail.com"),
      user_factory("foobar"),
      user_factory("quxbar"),
    ]

    orgs = [
      org_factory("projeto-spider"),
      org_factory("federal-university-of-para"),
      org_factory("nihon-hikikomori-kyokai"),
    ]

    org_memberships = [
      {"administer", "projeto-spider", "admin"},
      {"lubien", "projeto-spider", "admin"},
      {"leochrisis", "projeto-spider", "admin"},
      {"lubien", "federal-university-of-para", "member"},
      {"leochrisis", "federal-university-of-para", "member"},
      {"foobar", "nihon-hikikomori-kyokai", "admin"},
      {"quxbar", "nihon-hikikomori-kyokai", "member"}
    ]

    users
    |> Enum.map(fn user ->
      Task.async fn ->
        User.create_changeset(%User{}, user)
        |> Repo.insert!
      end
    end)
    |> Task.yield_many

    orgs
    |> Enum.map(fn org ->
      Task.async fn ->
        Organization.create_changeset(%Organization{}, org)
        |> Repo.insert!
      end
    end)
    |> Task.yield_many

    org_memberships
    |> Enum.map(fn {username, org_name, role} ->
      Task.async fn ->
        %{id: user_id} = Repo.get_by(User, username: username)
        %{id: org_id} = Repo.get_by(Organization, name: org_name)

        membership = org_membership_factory(user_id, org_id, role)

        OrganizationMember.create_changeset(%OrganizationMember{}, membership)
        |> Repo.insert!
      end
    end)
    |> Task.yield_many
  end

  def unseed do
    Repo.delete_all OrganizationMember
    Repo.delete_all Organization
    Repo.delete_all User
  end

  # Helpers

  def user_factory(username), do: user_factory(username, "#{username}@example.com")
  def user_factory(username, email) do
    %{"username" => username, "email" => email,
      "password" => "123456", "password_confirmation" => "123456"}
  end

  def org_factory(name) do
    %{"name" => name, "display_name" => Macro.camelize(name), "url" => "https://#{name}.example.dot",
      "description" => "Lorem ipsum dolor sit amet"}
  end

  def org_membership_factory(user_id, org_id, role \\ "member") do
    %{"user_id" => user_id, "organization_id" => org_id, "role" => role}
  end
end

CLI.init
