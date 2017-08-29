defmodule App.ProjectsTest do
  use App.DataCase

  alias App.Accounts
  alias App.Projects

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{email: "foobar@example.com", name: "foobar",
                     password: "some password"})
      |> Accounts.create_user()

    user
  end

  describe "projects" do
    alias App.Projects.Project

    @valid_attrs %{name: "some name", votation_time: 3}
    @update_attrs %{name: "some updated name", votation_time: 4, organization: "some org"}
    @invalid_attrs %{name: nil, votation_time: nil}

    def project_fixture(attrs \\ %{}) do
      manager = user_fixture()

      {:ok, project} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Projects.create_project(manager)

      project
    end

    test "list_projects/0 returns all projects" do
      project = project_fixture()
      assert Projects.list_projects() == [project]
    end

    test "list_user_projects/1 returns all projects that user_id belongs" do
      one_user = user_fixture()
      other_user = user_fixture(%{email: "other@example.com"})
      {:ok, project} = Projects.create_project(@valid_attrs, one_user)
      assert Projects.list_user_projects(one_user.id) == [project]
      assert Projects.list_user_projects(other_user.id) == []
    end

    test "get_project!/1 returns the project with given id" do
      project = project_fixture()
      assert Projects.get_project!(project.id) == project
    end

    test "create_project/2 with valid data creates a project" do
      manager = user_fixture()
      assert {:ok, %Project{} = project} = Projects.create_project(@valid_attrs, manager)
      assert project.name == @valid_attrs.name
      assert project.votation_time == @valid_attrs.votation_time
      assert project.manager_id == manager.id
      assert true == Projects.member?(project.id, manager.id)
    end

    test "create_project/2 with invalid data returns error changeset" do
      manager = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Projects.create_project(@invalid_attrs, manager)
    end

    test "update_project/2 with valid data updates the project" do
      project = project_fixture()
      assert {:ok, project} = Projects.update_project(project, @update_attrs)
      assert %Project{} = project
      assert project.name == @update_attrs.name
      assert project.votation_time == @update_attrs.votation_time
      assert project.organization == @update_attrs.organization
    end

    test "update_project/2 with invalid data returns error changeset" do
      project = project_fixture()
      assert {:error, %Ecto.Changeset{}} = Projects.update_project(project, @invalid_attrs)
      assert project == Projects.get_project!(project.id)
    end

    test "update_project/2 may update the manager" do
      project = project_fixture()
      new_manager = user_fixture(%{email: "foobaz@example.com"})
      refute project.manager_id == new_manager.id
      update_attrs = %{manager_id: new_manager.id}
      assert {:ok, project} = Projects.update_project(project, update_attrs)
      assert %Project{} = project
      assert project.manager_id == new_manager.id
    end

    test "update_project/2 may update the po" do
      project = project_fixture()
      po = user_fixture(%{email: "foobaz@example.com"})
      refute project.po_id == po.id
      update_attrs = %{po_id: po.id}
      assert {:ok, project} = Projects.update_project(project, update_attrs)
      assert %Project{} = project
      assert project.po_id == po.id
    end

    test "delete_project/1 deletes the project" do
      project = project_fixture()
      assert {:ok, %Project{}} = Projects.delete_project(project)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_project!(project.id) end
    end

    test "deleting a manager deletes it's projects" do
      project = project_fixture()
      po = user_fixture(%{email: "foobaz@example.com"})
      update_attrs = %{po_id: po.id}
      assert {:ok, project} = Projects.update_project(project, update_attrs)
      assert project.po_id == po.id
      Accounts.delete_user(po)
      assert %Project{po_id: po_id} = Projects.get_project!(project.id)
      refute po_id == po.id
      assert po_id == nil
    end

    test "deleting a po nilify it's field" do
      manager = user_fixture()
      {:ok, project} = Projects.create_project(@valid_attrs, manager)
      Accounts.delete_user(manager)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_project!(project.id) end
    end
  end

  describe "members" do
    alias App.Projects.Member

    def member_fixture(project_id \\ nil, user \\ nil) do
      {:ok, member} = Projects.add_member(project_id, user.id)
      member
    end

    setup do
      manager = user_fixture(%{name: "some manager", email: "manager@example.com"})
      user = user_fixture(%{name: "some member", email: "member@example.com"})
      {:ok, project} = Projects.create_project(%{name: "some project"}, manager)

      {:ok, manager: manager, user: user, project: project}
    end

    test "list_members/1 returns all members from project", context do
      %{project: project, manager: manager} = context
      member = Projects.get_member!(project.id, manager.id)
      assert Projects.list_members(project.id) == [member]
    end

    test "get_member!/2 returns the member with given id from given project", context do
      %{project: project, user: user} = context
      {:ok, member} = Projects.add_member(project.id, user.id)
      assert Projects.get_member!(project.id, user.id) == member
    end

    test "add_member/2 with valid data creates a member", context do
      %{project: project, user: user} = context
      {:ok, member} = Projects.add_member(project.id, user.id)
      assert %Member{} = member
      assert member.project_id == project.id
      assert member.user_id == user.id
    end

    test "remove_member/1 deletes the member", context do
      %{project: project, user: user} = context
      {:ok, member} = Projects.add_member(project.id, user.id)
      assert {:ok, %Member{}} = Projects.remove_member(member)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_member!(project.id, user.id) end
    end
  end

  describe "backlog" do
    alias App.Projects.Story

    setup do
      manager = user_fixture(%{name: "some manager", email: "manager@example.com"})
      {:ok, project} = Projects.create_project(%{name: "some project"}, manager)

      {:ok, manager: manager, project: project}
    end

    test "backlog/1 display a project backlog", %{project: project} do
      assert [] == Projects.backlog(project)

      assert {:ok, project, story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog
      assert ["Foo"] == for s <- Projects.backlog(project), do: s.title

      assert {:ok, project, other_story} = Projects.unshift_story(project, %{title: "Other"})
      assert [other_story.id, story.id] == project.backlog
      assert ["Other", "Foo"] == for s <- Projects.backlog(project), do: s.title
    end

    test "backlog/1 also display nested stories", %{project: project} do
      assert [] == Projects.backlog(project)

      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog

      assert ["Foo"] == for story <- Projects.backlog(project), do: story.title

      assert {:ok, story, %Story{} = child_a} = Projects.unshift_story(story, %{title: "Bar"})
      assert [child_a.id] == story.backlog

      assert {:ok, story, %Story{} = child_b} = Projects.unshift_story(story, %{title: "Baz"})
      assert [child_b.id, child_a.id] == story.backlog

      assert [%Story{
        children: [%Story{}, %Story{}] = substories
      } = father] = Projects.backlog(project)
      assert father.id == story.id
      assert ["Baz", "Bar"] == for story <- substories, do: story.title
    end

    test "get_story/1 fetches a story", %{project: project} do
      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog
      assert Projects.get_story!(story.id)
    end

    test "unshift_story/2 create a story at the start of a project", %{project: project} do
      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog
    end

    test "unshift_story/2 may also put nested stories", %{project: project} do
      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog

      assert {:ok, story, %Story{} = child_a} = Projects.unshift_story(story, %{title: "Bar"})
      assert [child_a.id] == story.backlog

      assert {:ok, story, %Story{} = child_b} = Projects.unshift_story(story, %{title: "Baz"})
      assert [child_b.id, child_a.id] == story.backlog

      assert [%Story{
        children: [%Story{} = other_a, %Story{} = other_b]
      } = father] = Projects.backlog(project)
      assert father.id == story.id
      assert child_b.id == other_a.id
      assert child_a.id == other_b.id
    end

    test "move_story/3 properly reorder stories", %{project: project} do
      assert {:ok, project, %Story{} = story_a} = Projects.unshift_story(project, %{title: "Foo"})
      assert {:ok, project, %Story{} = story_b} = Projects.unshift_story(project, %{title: "Bar"})
      assert {:ok, project, %Story{} = story_c} = Projects.unshift_story(project, %{title: "Baz"})
      assert [story_c.id, story_b.id, story_a.id] == project.backlog

      {:ok, project} = Projects.move_story(project, story_a.id, 0)
      assert [story_a.id, story_c.id, story_b.id] == project.backlog

      {:ok, project} = Projects.move_story(project, story_c.id, 2)
      assert [story_a.id, story_b.id, story_c.id] == project.backlog

      {:ok, project} = Projects.move_story(project, story_a.id, 1_000_00)
      assert [story_b.id, story_c.id, story_a.id] == project.backlog
    end

    test "move_story/3 work with substories too", %{project: project} do
      assert {:ok, project, %Story{} = parent} = Projects.unshift_story(project, %{title: "Foo"})
      assert {:ok, parent, %Story{} = child_a} = Projects.unshift_story(parent, %{title: "Bar"})
      assert {:ok, parent, %Story{} = child_b} = Projects.unshift_story(parent, %{title: "Baz"})
      assert [parent.id] == project.backlog
      assert [child_b.id, child_a.id] == parent.backlog

      {:ok, parent} = Projects.move_story(parent, child_a.id, 0)
      assert [child_a.id, child_b.id] == parent.backlog

      {:ok, parent} = Projects.move_story(parent, child_b.id, 0)
      assert [child_b.id, child_a.id] == parent.backlog
    end

    test "update_story/2 updates a story when given valid attrs", %{project: project} do
      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog
      assert {:ok, %Story{} = updated} = Projects.update_story(story, %{title: "Bar", estimation: 10})
      assert updated.title == "Bar"
      assert updated.estimation == 10
    end

    test "delete_story/2 deletes a story", %{project: project} do
      assert {:ok, project, %Story{} = story} = Projects.unshift_story(project, %{title: "Foo"})
      assert [story.id] == project.backlog

      assert {:ok, project, %Story{}} = Projects.delete_story(project, story)
      assert [] == project.backlog

      assert_raise Ecto.NoResultsError, fn -> Projects.get_story!(story.id) end
    end

    test "delete_story/2 may also delete children stories", %{project: project} do
      assert {:ok, project, %Story{} = father} = Projects.unshift_story(project, %{title: "Foo"})
      assert [father.id] == project.backlog

      assert {:ok, father, %Story{} = child} = Projects.unshift_story(father, %{title: "Bar"})
      assert [child.id] == father.backlog

      assert {:ok, father, %Story{} = child} = Projects.delete_story(father, child)
      assert [father.id] == project.backlog
      assert [] == father.backlog

      assert Projects.get_story!(father.id)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_story!(child.id) end
    end

    test "delete_story/2 delete children when parent is deleted", %{project: project} do
      assert {:ok, project, %Story{} = father} = Projects.unshift_story(project, %{title: "Foo"})
      assert [father.id] == project.backlog

      assert {:ok, father, %Story{} = child} = Projects.unshift_story(father, %{title: "Bar"})
      assert [child.id] == father.backlog

      assert {:ok, project, %Story{} = father} = Projects.delete_story(project, father)
      assert [] == project.backlog

      assert_raise Ecto.NoResultsError, fn -> Projects.get_story!(father.id) end
      assert_raise Ecto.NoResultsError, fn -> Projects.get_story!(child.id) end
    end
  end

  describe "game" do
    alias Projects.Game

    setup do
      manager = user_fixture(%{name: "some manager", email: "manager@example.com"})
      {:ok, project} = Projects.create_project(%{name: "some project"}, manager)
      {:ok, project, story} = Projects.unshift_story(project, %{title: "Foo"})

      {:ok, manager: manager, project: project, story: story}
    end

    test "get_game/1 fetches a game", %{story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert %Game{} = got = Projects.get_game!(game.id)
      assert got.id == game.id
    end

    test "create_game/1 starts a game for a story", %{story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert game.votes == %{}
      assert game.state == Game.state().created
    end

    test "update_game/2 updates a game", %{story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert game.votes == %{}
      assert game.state == Game.state().created

      votes = %{"foo" => 1, "bar" => 2}
      now = DateTime.utc_now()
      attrs = %{votes: votes, voting_start: now}
      assert {:ok, %Game{} = game} = Projects.update_game(game, attrs)
      assert game.votes == votes
      assert game.voting_start == now
    end

    test "deleting a story deletes it's games", %{project: project, story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert {:ok, _project, _story} = Projects.delete_story(project, story)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_game!(game.id) end
    end

    test "poison encoder hides votes while voting", %{story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)

      decoded =
        game
        |> Poison.encode!
        |> Poison.decode!

      assert decoded["votes"] == %{}

      attrs = %{state: Game.state().voting}
      assert {:ok, %Game{} = game} = Projects.update_game(game, attrs)

      decoded =
        game
        |> Poison.encode!
        |> Poison.decode!
      
      assert decoded["votes"] == []
    end

    test "a project may have a current game", %{project: project, story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert {:ok, project} = Projects.update_project(project, %{current_game: game.id})
      assert project.current_game == game.id
    end

    test "deleting the project deletes it's games", %{project: project, story: story} do
      assert {:ok, %Game{} = game} = Projects.create_game(story)
      assert {:ok, _project} = Projects.delete_project(project)
      assert_raise Ecto.NoResultsError, fn -> Projects.get_game!(game.id) end
    end
  end
end
