import Vue from 'vue'
import Router from 'vue-router'

import store from 'app/store'
import {
  AuthPanel, BaseLayout, GameLayout
} from 'app/layouts'
import views from '../views'

const {
  Auth,
  Pages,
  Users,
  Organizations,
  Projects,
  Backlogs,
  Game,
  ErrorViews
} = views

Vue.use(Router)

export default new Router({
  mode: 'history',
  history: true,
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/auth',
      component: AuthPanel,
      children: [
        {
          name: 'login',
          path: 'login',
          component: Auth.Login,
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'register',
          path: 'register',
          component: Auth.Register,
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'logout',
          path: 'logout',
          component: Auth.Logout
        }
      ]
    },

    {
      path: '/game',
      component: GameLayout,
      children: [
        {
          name: 'board',
          path: '/',
          component: Game.Board
        }
      ]
    },

    {
      path: '/',
      component: BaseLayout,
      children: [
        // Pages
        {
          path: '/',
          name: 'home',
          component: Pages.Home
        },

        // Users
        {
          name: 'userShow',
          path: '@:username',
          component: Users.Show
        },

        {
          name: 'usersList',
          path: 'users',
          component: Users.List
        },

        {
          name: 'userEdit',
          path: 'profile/edit',
          component: Users.Edit,
          beforeEnter: requireAuth()
        },

        // Organizations
        {
          name: 'organizationCreate',
          path: 'organization/create',
          component: Organizations.Create
        },

        {
          name: 'organizationShow',
          path: 'organization/:organization',
          component: Organizations.Show
        },

        {
          name: 'organizationEdit',
          path: 'organization/:organization/edit',
          component: Organizations.Edit
        },

        {
          name: 'organizationsList',
          path: 'organizations',
          component: Organizations.List
        },

        // Projects
        {
          name: 'projectCreate',
          path: 'organization/:organization/project/create',
          component: Projects.Create,
          beforeEnter: requireAuth()
        },

        {
          name: 'projectShow',
          path: 'project/:project',
          component: Projects.Show,
          beforeEnter: requireAuth()
        },

        {
          name: 'projectEdit',
          path: 'project/:project/edit',
          component: Projects.Edit,
          beforeEnter: requireAuth()
        },

        {
          name: 'projectsList',
          path: 'projects',
          component: Projects.List
        },

        {
          name: 'organizationProjectsList',
          path: 'organization/:organization/projects',
          component: Projects.List
        },

        // Backlogs

        {
          name: 'backlogShow',
          path: 'project/:project/backlog',
          component: Backlogs.Show
        },

        // Errors

        {
          name: 'error404',
          path: 'errors/404',
          component: ErrorViews.Error404
        },

        {
          name: 'error403',
          path: 'errors/403',
          component: ErrorViews.Error403
        }
      ]
    },

    {
      path: '*',
      name: 'fallback',
      component: ErrorViews.Error404
    }
  ]
})

// Helpers

function requireAuthStatus(should) {
  return (to, from, next) => {
    const token = store.state.auth.token

    if (should === 'on' && !token) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    } else if (should === 'off' && token) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
}

function requireAuth() {
  return requireAuthStatus('on')
}

function requireLoggedOff() {
  return requireAuthStatus('off')
}
