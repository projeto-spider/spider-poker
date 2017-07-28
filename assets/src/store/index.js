import Vue from 'vue'
import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'

import * as auth from './modules/auth'
import * as projects from './modules/projects'

Vue.use(Vuex)
Vue.config.debug = true

export default new Vuex.Store({
  strict: true,

  modules: {
    auth,
    projects
  },

  plugins: [
    Logger()
  ]
})
