import Vue from 'vue'
import Router from 'vue-router'
import store from 'app/store'

const layout = name => require('../layouts/${name}')
const view = name => require('../views/${name}')

Vue.use(Router)

export default new Router({
  mode: 'history',
  history: true,
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/auth',
      component: layout('auth-panel'),
      children: [
        {
          name: 'login',
          path: 'login',
          component: view('auth/login'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'register',
          path: 'register',
          component: view('auth/register'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'logout',
          path: 'logout',
          component: view('auth/logout')
        }
      ]
    },

    {
      path: '/game',
      component: layout('game'),
      children: [
        {
          name: 'board',
          path: '/',
          component: view('game/board')
        }
      ]
    },

    {
      path: '/',
      component: layout('base'),
      children: [
        // Pages
        {
          path: '/',
          name: 'home',
          component: view('pages/home')
        },

        // Users
        {
          name: 'userShow',
          path: '@:username',
          component: view('users/show')
        },

        {
          name: 'usersList',
          path: 'users',
          component: view('users/list')
        },

        {
          name: 'userEdit',
          path: 'profile/edit',
          component: view('users/edit'),
          beforeEnter: requireAuth()
        },

        // Organizations
        {
          name: 'organizationCreate',
          path: 'organization/create',
          component: view('organizations/create')
        },

        {
          name: 'organizationShow',
          path: 'organization/:organization',
          component: view('organizations/show')
        },

        {
          name: 'organizationEdit',
          path: 'organization/:organization/edit',
          component: view('organizations/edit')
        },

        {
          name: 'organizationsList',
          path: 'organizations',
          component: view('organizations/list')
        },

        // Projects
        {
          name: 'projectCreate',
          path: 'organization/:organization/project/create',
          component: view('projects/create'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectShow',
          path: 'project/:project',
          component: view('projects/show'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectEdit',
          path: 'project/:project/edit',
          component: view('projects/edit'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectsList',
          path: 'projects',
          component: view('projects/list')
        },

        {
          name: 'organizationProjectsList',
          path: 'organization/:organization/projects',
          component: view('projects/list')
        },

        // Backlogs

        {
          name: 'backlogShow',
          path: 'project/:project/backlog',
          component: view('backlog/show')
        },

        // Errors

        {
          name: 'error404',
          path: 'errors/404',
          component: view('errors/404')
        },

        {
          name: 'error403',
          path: 'errors/403',
          component: view('errors/403')
        }
      ]
    },

    {
      path: '*',
      name: 'fallback',
      component: view('errors/404')
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
