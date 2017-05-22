// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from 'app/store'
import NProgress from 'vue-nprogress'
import {App} from 'app/components'
import router from './router'

const nprogress = new NProgress()

Vue.use(NProgress)
Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  el: '#content',
  router,
  store,
  nprogress,
  template: '<App/>',
  components: { App }
})

if (process.env.NODE_ENV === 'development') {
  window.App = app
}
