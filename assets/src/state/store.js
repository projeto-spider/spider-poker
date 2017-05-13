import Vue from 'vue'
import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'

import auth from './modules/auth'
import page from './modules/page'
import * as ui from './modules/ui'

Vue.use(Vuex)
Vue.config.debug = true

export default new Vuex.Store({
  strict: true,

  modules: {
    auth, page, ui
  },

  plugins: [
    Logger()
  ]
})
