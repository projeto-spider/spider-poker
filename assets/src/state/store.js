import Vue from 'vue'
import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'

import auth from './modules/auth'
import page from './modules/page'

Vue.use(Vuex)
Vue.config.debug = true

export default new Vuex.Store({
  strict: true,

  modules: {
    auth, page
  },

  plugins: [
    Logger()
  ]
})
