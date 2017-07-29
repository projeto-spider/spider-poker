import Vue from 'vue'
import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'
import VuexPersistence from 'vuex-persist'

import * as auth from './modules/auth'
import * as projects from './modules/projects'
import * as socket from './modules/socket'
import * as notifications from './modules/notifications'

Vue.use(Vuex)
Vue.config.debug = true

const persistence = new VuexPersistence({
  storage: window.localStorage,
  reducer: ({auth, projects: {projects, selectedProjectId}}) => ({
    auth, projects: {projects, selectedProjectId}
  }),
  filter: ({type}) =>
    [
      'setToken',
      'setUser',
      'projectsSynced',
      'selectProject',
      'pushProject',
      'updateProject',
      'removeProject'
    ].includes(type)
})

export default new Vuex.Store({
  strict: true,

  modules: {
    auth,
    socket,
    notifications,
    projects
  },

  plugins: [
    persistence.plugin,
    Logger()
  ]
})
