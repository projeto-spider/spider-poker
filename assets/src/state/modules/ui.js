import {prop} from 'ramda'

const commit = (...args) => context => context.commit(...args)

export const state = {
  screenWidth: window.innerWidth,
  sidebarOpen: false
}

export const mutations = {
  updateScreenSize(state) {
    state.screenWidth = window.innerWidth
  },

  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },

  setSidebarState(state, next) {
    state.sidebarOpen = next
  }
}

export const actions = {
  toggleSidebar: commit('toggleSidebar'),
  closeSidebar: commit('setSidebarState', false),
  openSidebar: commit('setSidebarState', true)
}

export const getters = {
  sidebarOpen: prop('sidebarOpen'),
  screenWidth: prop('screenWidth')
}
