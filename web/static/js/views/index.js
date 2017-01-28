// Auth
import Login from './auth/login'
import Register from './auth/register'
import Logout from './auth/logout'

// Pages
import Home from './pages/home'

// Users
import UserShow from './users/show'
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
    UserShow,
    UsersList
  },

  Organizations: {
    OrganizationShow,
    OrganizationsList
  },

  ErrorViews: {
    Error404
  }
}
