export const state = {
  token: '',
  user: null
}

export const mutations = {
  set_token(state, token) {
    state.token = token
  },
  set_user(state, user) {
    state.user = user
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  },

  loggedUser(state) {
    return state.user
  }
}
