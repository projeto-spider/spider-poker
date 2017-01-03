import store from 'app/state';
import {
  AuthPanel, DashBoard
} from 'app/layouts';
import views from '../views';

export default [
  {
    path: '/auth',
    component: AuthPanel,
    children: [
      {name: 'login', path: 'login', component: views.Auth.Login, beforeEnter: requireLoggedOff()},
      {name: 'register', path: 'register', component: views.Auth.Register, beforeEnter: requireLoggedOff()},
      {name: 'logout', path: 'logout', component: views.Auth.Logout},
    ]
  },

  {
    path: '/',
    name: 'home',
    component: DashBoard,
    children: [
      {name: 'organization', path: 'organization/:id', component: views.Organizations.Show},
      {name: 'organizations', path: 'organizations', component: views.Organizations.List},
    ]
  },

  {
    path: '*',
    name: 'error',
    component: views.Errors.Error404
  },
]

// Helpers

function requireAuthStatus(should) {
  return (to, from, next) => {
    const token = store.state.auth.token;

    if (should === 'on' && !token) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      });
    } else if (should === 'off' && token) {
      next({
        path: '/',
      });
    } else {
      next();
    }
  }
}

function requireAuth() {
  return requireAuthStatus('on');
}

function requireLoggedOff() {
  return requireAuthStatus('off');
}
