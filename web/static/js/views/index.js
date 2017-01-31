// Auth
import Login from './auth/login'
import Register from './auth/register'
import Logout from './auth/logout'

// Pages
import Home from './pages/home'

// Users
import UserShow from './users/show'
import UserEdit from './users/edit'
import UsersList from './users/list'

// Organizations
import OrganizationShow from './organizations/show'
import OrganizationsList from './organizations/list'

// Errors
import Error404 from './errors/404'

export default {
  Auth: {
    Login,
    Register,
    Logout
  },

  Pages: {
    Home
  },

  Users: {
    Show: UserShow,
    List: UsersList,
    Edit: UserEdit
  },

  Organizations: {
    Show: OrganizationShow,
    List: OrganizationsList
  },

  ErrorViews: {
    Error404
  }
}
