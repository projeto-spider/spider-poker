import Vue from 'vue'
import Router from 'vue-router'
import store from 'app/store'

const layout = name => require(`../layouts/${name}.vue`)
const page = name => require(`../pages/${name}.vue`)

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
          component: page('auth/login'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'register',
          path: 'register',
          component: page('auth/register'),
          beforeEnter: requireLoggedOff()
        },

        {
          name: 'logout',
          path: 'logout',
          component: page('auth/logout')
        }
      ]
    },

    {
      path: '/',
      component: layout('game'),
      children: [
        {
          name: 'board',
          path: '/game/:project',
          component: page('game/board')
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
          component: page('pages/home')
        },

        // Users
        {
          name: 'userShow',
          path: '@:username',
          component: page('users/show')
        },

        {
          name: 'usersList',
          path: 'users',
          component: page('users/list')
        },

        {
          name: 'userEdit',
          path: 'profile/edit',
          component: page('users/edit'),
          beforeEnter: requireAuth()
        },

        // Organizations
        {
          name: 'organizationCreate',
          path: 'organization/create',
          component: page('organizations/create')
        },

        {
          name: 'organizationShow',
          path: 'organization/:organization',
          component: page('organizations/show')
        },

        {
          name: 'organizationEdit',
          path: 'organization/:organization/edit',
          component: page('organizations/edit')
        },

        {
          name: 'organizationsList',
          path: 'organizations',
          component: page('organizations/list')
        },

        // Projects
        {
          name: 'projectCreate',
          path: 'organization/:organization/project/create',
          component: page('projects/create'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectShow',
          path: 'project/:project',
          component: page('projects/show'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectEdit',
          path: 'project/:project/edit',
          component: page('projects/edit'),
          beforeEnter: requireAuth()
        },

        {
          name: 'projectsList',
          path: 'projects',
          component: page('projects/list')
        },

        {
          name: 'organizationProjectsList',
          path: 'organization/:organization/projects',
          component: page('projects/list')
        },

        // Backlogs

        {
          name: 'backlogShow',
          path: 'project/:project/backlog',
          component: page('backlog/show')
        },

        // Errors

        {
          name: 'error404',
          path: 'errors/404',
          component: page('errors/404')
        },

        {
          name: 'error403',
          path: 'errors/403',
          component: page('errors/403')
        }
      ]
    },

    {
      path: '*',
      name: 'fallback',
      component: page('errors/404')
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
