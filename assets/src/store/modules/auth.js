import axios from 'utils/axios'

export const state = {
  token: '',
  user: null
}

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  setUser(state, user) {
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

export const actions = {
  async login({commit}, data) {
    const {data: {token}} = await axios.post('/sessions', {data})
    commit('setToken', token)
    const {data: user} = await axios.get('/sessions')
    commit('setUser', user)
  },

  async loginWithToken({commit}, token) {
    commit('setToken', token)
    const {data: user} = await axios.get('/sessions')
    commit('setUser', user)
  },

  logout({commit}) {
    commit('setToken', '')
    commit('setUser', null)
  },

  async register({dispatch, commit}, data) {
    const {email, password} = data
    await axios.post('/users', {data})
    return dispatch('login', {email, password})
  }
}
