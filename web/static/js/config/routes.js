import store from 'app/state';
import {
  App, ErrorView, Login, Register, Logout
} from 'app/components';
import {
  AuthPanel, DashBoard
} from 'app/layouts';

export default [
  {
    path: '/auth',
    component: AuthPanel,
    children: [
      {name: 'login', path: 'login', component: Login, beforeEnter: requireLoggedOff()},
      {name: 'register', path: 'register', component: Register, beforeEnter: requireLoggedOff()},
      {name: 'logout', path: 'logout', component: Logout},
    ]
  },

  {
    path: '/',
    name: 'home',
    component: DashBoard
  },

  {
    path: '*',
    name: 'error',
    component: ErrorView
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
