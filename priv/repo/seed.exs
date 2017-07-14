alias Poker.Accounts
alias Poker.Accounts.User
alias Poker.Organizations
alias Poker.Organizations.Organization
alias Poker.Projects
alias Poker.Projects.Project

defmodule ID do
  def start_link do
    initial = %{
      user: %{},
      organization: %{},
      project: %{}
    }
    Agent.start_link(fn -> initial end, name: __MODULE__)
  end

  def add(type, name, id) do
    Agent.update(__MODULE__, &put_in(&1, [type, name], id))
  end

  def get(type, name) do
    Agent.get(__MODULE__, &get_in(&1, [type, name]))
  end
end

ID.start_link()

slug_to_display_name = fn slug ->
  slug
  |> String.split("-")
  |> Enum.map(&String.capitalize/1)
  |> Enum.join(" ")
end

admins = ["administer", "lubien", "leochrisis"]

[
  "administer",
  {"lubien", "lubien1996@gmail.com"},
  {"leochrisis", "leonardo.chfc@gmail.com"},
  "foobar",
  "quxbar",
]
|> Enum.map(fn user ->
  Task.async fn ->
    {username, email} =
      case user do
        {username, email} ->
          {username, email}
        username ->
          {username, username <> "@example.com"}
      end

    attrs = %{"username" => username, "email" => email,
              "password" => "123456", "password_confirmation" => "123456"}

    {:ok, %User{id: id} = user} = Accounts.create(attrs)

    if Enum.find(admins, false, &(&1 == user.username)) do
      {:ok, _user} = Accounts.grant_admin(user)
    end

    ID.add(:user, username, id)
  end
end)
|> Task.yield_many

[
  {"projeto-spider", false},
  {"federal-university-of-para", false},
  {"nihon-hikikomori-kyokai", true},
]
|> Enum.map(fn {name, private?} ->
  Task.async fn ->
    attrs = %{"name" => name, "display_name" => slug_to_display_name.(name),
              "url" => "https://#{name}.example.dot", "private" => private?,
              "description" => "Lorem ipsum dolor sit amet"}

    {:ok, %Organization{id: id}} = Organizations.create(attrs)
    ID.add(:organization, name, id)
  end
end)
|> Task.yield_many

[
  {"administer", "projeto-spider", "admin"},
  {"lubien", "projeto-spider", "admin"},
  {"leochrisis", "projeto-spider", "admin"},
  {"lubien", "federal-university-of-para", "member"},
  {"leochrisis", "federal-university-of-para", "member"},
  {"lubien", "nihon-hikikomori-kyokai", "member"},
  {"foobar", "nihon-hikikomori-kyokai", "admin"},
  {"quxbar", "nihon-hikikomori-kyokai", "member"}
]
|> Enum.map(fn {username, org_name, role} ->
  Task.async fn ->
    user_id = ID.get(:user, username)
    org_id = ID.get(:organization, org_name)

    {:ok, _} = Organizations.add_member(org_id, user_id, role)
  end
end)
|> Task.yield_many

[
  {"planning-poker", "projeto-spider", false},
  {"cacc-ufpa", "federal-university-of-para", false},
  {"casi-ufpa", "federal-university-of-para", false},
  {"inboou", "nihon-hikikomori-kyokai", true},
]
|> Enum.map(fn {name, org_name, private?} ->
  Task.async fn ->
    org_id = ID.get(:organization, org_name)

    attrs = %{"organization_id" => org_id,
              "name" => name, "private" => private?,
              "display_name" => slug_to_display_name.(name),
              "description" => "Lorem ipsum dolor sit amet"}

    {:ok, %Project{id: id}} = Projects.create(attrs)
    ID.add(:project, name, id)
  end
end)
|> Task.yield_many

[
  {"administer", "planning-poker", "po"},
  {"lubien", "planning-poker", "manager"},
  {"leochrisis", "planning-poker", "team"},
  {"lubien", "cacc-ufpa", "team"},
  {"leochrisis", "cacc-ufpa", "manager"},
  {"foobar", "inboou", "po"},
  {"quxbar", "inboou", "manager"}
]
|> Enum.map(fn {username, proj_name, role} ->
  Task.async fn ->
    user_id = ID.get(:user, username)
    proj_id = ID.get(:project, proj_name)

    {:ok, _} = Projects.add_member(proj_id, user_id, role)
  end
end)
|> Task.yield_many

[
  {"planning-poker", [
    %{"title" => "First", "description" => "Lorem"},
    %{"title" => "Second", "description" => "Ipsum"},
    %{"title" => "Third", "description" => "Sit"},
  ]}
]
|> Enum.map(fn {proj_name, stories} ->
  Task.async fn ->
    proj_id = ID.get(:project, proj_name)

    stories
    |> Enum.map(fn attrs ->
      data = Map.put(attrs, "project_id", proj_id)
      {:ok, _} = Projects.add_story(proj_id, data)
    end)
  end
end)
|> Task.yield_many
