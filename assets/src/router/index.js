import Vue from 'vue'
import Router from 'vue-router'
import store from 'app/store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  history: true,
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/auth',
      component: require('../layouts/auth-panel'),
      children: [
        {
          name: 'login',
          path: 'login',
          component: require('../views/auth/login'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'register',
          path: 'register',
          component: require('../views/auth/register'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'logout',
          path: 'logout',
          component: require('../views/auth/logout')
        }
      ]
    },

    {
      path: '/game',
      component: require('../layouts/game'),
      children: [
        {
          name: 'board',
          path: '/',
          component: require('../views/game/board')
        }
      ]
    },

    {
      path: '/',
      component: require('../layouts/base'),
      children: [
        // Pages
        {
          path: '/',
          name: 'home',
          component: require('../views/pages/home')
        },

        // Users
        {
          name: 'userShow',
          path: '@:username',
          component: require('../views/users/show')
        },

        {
          name: 'usersList',
          path: 'users',
          component: require('../views/users/list')
        },

        {
          name: 'userEdit',
          path: 'profile/edit',
          component: require('../views/users/edit'),
          beforeEnter: requireAuth()
        },

        // Organizations
        {
          name: 'organizationCreate',
          path: 'organization/create',
          component: require('../views/organizations/create')
        },

        {
          name: 'organizationShow',
          path: 'organization/:organization',
          component: require('../views/organizations/show')
        },

        {
          name: 'organizationEdit',
          path: 'organization/:organization/edit',
          component: require('../views/organizations/edit')
        },

        {
          name: 'organizationsList',
          path: 'organizations',
          component: require('../views/organizations/list')
        },

        // Projects
        {
          name: 'projectCreate',
          path: 'organization/:organization/project/create',
          component: require('../views/projects/create'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectShow',
          path: 'project/:project',
          component: require('../views/projects/show'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectEdit',
          path: 'project/:project/edit',
          component: require('../views/projects/edit'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectsList',
          path: 'projects',
          component: require('../views/projects/list')
        },

        {
          name: 'organizationProjectsList',
          path: 'organization/:organization/projects',
          component: require('../views/projects/list')
        },

        // Backlogs

        {
          name: 'backlogShow',
          path: 'project/:project/backlog',
          component: require('../views/backlog/show')
        },

        // Errors

        {
          name: 'error404',
          path: 'errors/404',
          component: require('../views/errors/404')
        },

        {
          name: 'error403',
          path: 'errors/403',
          component: require('../views/errors/403')
        }
      ]
    },

    {
      path: '*',
      name: 'fallback',
      component: require('../views/errors/404')
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
