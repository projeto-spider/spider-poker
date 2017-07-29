import {Socket} from 'phoenix'

/* ( ͡° ͜ʖ ͡°) */
let _socket = false

export const state = {
  socket: false
}

export const mutations = {
  setSocket(state, socket) {
    state.socket = !!socket
  }
}

export const getters = {
  socketConnected(state) {
    return !!state.socket
  },

  socket() {
    return _socket
  }
}

export const actions = {
  connectSocket({rootState, commit}) {
    const {token} = rootState.auth

    if (_socket) {
      _socket.disconnect()
    }

    _socket = new Socket('/socket', {params: {token}})
    _socket.connect()
    commit('setSocket', _socket)
  },

  disconnectSocket({commit}) {
    _socket.disconnect()
    _socket = false
    commit('setSocket', false)
  }
}
