import {prop} from 'ramda'

const commit = (...args) => context => context.commit(...args)

export const state = {
  sidebarOpen: false,
  fullheightPage: false,
  hideFooter: false
}

export const mutations = {
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },

  setSidebarState(state, next) {
    state.sidebarOpen = next
  },

  setFullheightPageState(state, next) {
    state.fullheightPage = next
  },

  setHideFooterState(state, next) {
    state.hideFooter = next
  }
}

export const actions = {
  toggleSidebar: commit('toggleSidebar'),
  closeSidebar: commit('setSidebarState', false),
  openSidebar: commit('setSidebarState', true),
  hideFooter: commit('setHideFooterState', true),
  showFooter: commit('setHideFooterState', false),
  enableFullheightPage: commit('setFullheightPageState', true),
  disableFullheightPage: commit('setFullheightPageState', false)
}

export const getters = {
  sidebarOpen: prop('sidebarOpen'),
  hideFooter: prop('hideFooter'),
  fullheightPage: prop('fullheightPage')
}
