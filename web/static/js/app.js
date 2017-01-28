import Vue from 'vue';
import 'babel-polyfill';
import store from 'app/store';
import VueRouter from 'vue-router';
import routes from './config/routes';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';
import NProgress from 'vue-nprogress';
import {App} from 'app/components'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);
Vue.use(NProgress);

const environment = process.env.NODE_ENV;

Vue.config.debug = (environment === 'development');
Vue.config.devtools = (environment === 'development');

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', store.state.auth.token);
  request.headers.set('Content-Type', 'application/vnd.api+json');
  request.headers.set('Accepts', 'application/vnd.api+json');
  next();
})

const router = new VueRouter({
  mode: 'history',
  history: true,
  linkActiveClass: 'is-active',
  routes
});

const nprogress = new NProgress();

const VueApp = new Vue({
  el: "#content",
  render: r => r(App),
  router, store, nprogress
})

if (window && environment === 'development') {
  window.App = VueApp
}
