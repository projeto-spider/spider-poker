const state = {
  token: recover('token') || '',
  user: recover('user') || null
}

const mutations = {
  set_token(state, token) {
    state.token = token
    persist('token', token)
  },
  set_user(state, user) {
    state.user = user
    persist('user', user)
  }
}

export default {
  namespaced: 'true',
  state,
  mutations
}

// Helpers

function recover(key) {
  if (!hasLocalStorage()) {
    return false
  }

  return JSON.parse(localStorage.getItem(key))
}

function persist(key, value) {
  if (!hasLocalStorage()) {
    return
  }

  localStorage.setItem(key, JSON.stringify(value))
}

function hasLocalStorage() {
  return window && window.localStorage
}
