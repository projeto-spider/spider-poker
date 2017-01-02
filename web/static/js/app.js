import Vue from 'vue';
import 'babel-polyfill';
import store from 'app/state';
import VueRouter from 'vue-router';
import routes from './config/routes';
import VueResource from 'vue-resource';
import VueValidator from 'vue-validator';
import RouterBase from './components/router-base.vue'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueValidator);

const environment = process.env.NODE_ENV;

Vue.config.debug = (environment === 'development');
Vue.config.devtools = (environment === 'development');

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', store.state.auth.token);
  next();
})

let router = new VueRouter({
  mode: 'history',
  history: true,
  routes
});

new Vue({
  el: "#content",
  render: r => r(RouterBase),
  router, store
})
