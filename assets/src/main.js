// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

if (!window.GA_ID) {
  // The library will error if none is defined :/
  window.GA_ID = 'UA-XXXXXX-1'
}

import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Quasar from 'quasar'
import router from './router'
import store from 'store'

Vue.use(Quasar) // Install Quasar Framework

Quasar.start(() => {
  Vue.use(VueAnalytics, {
    id: window.GA_ID
  })

  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    store,
    render: h => h(require('./app'))
  })
})
