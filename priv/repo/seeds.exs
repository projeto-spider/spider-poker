alias App.Accounts
{:ok, admin} = Accounts.create_user(%{name: "admin", email: "admin@example.com", password: "admin"})
{:ok, _admin} = Accounts.full_update_user(admin, %{admin?: true})