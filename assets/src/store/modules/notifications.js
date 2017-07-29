import {Toast} from 'quasar'

/* ( ͡° ͜ʖ ͡°) */
let _channel = false

export const state = {
  channel: false
}

export const mutations = {
  setNotificationsChannel(state, channel) {
    state.channel = !!channel
  }
}

export const getters = {
  notificationsChannel() {
    return _channel
  }
}

export const actions = {
  connectNotificationsChannel({rootState, getters, dispatch, commit}) {
    return new Promise(async (resolve, reject) => {
      if (_channel) {
        _channel.leave()
      }

      const {auth: {user}} = rootState
      const socket = getters.socket

      const name = `notifications:${user.id}`
      const params = {}
      const channel = socket.channel(name, params)

      channel.on('project:updated', dispatch.bind(null, 'projectUpdated'))
      channel.on('project:deleted', dispatch.bind(null, 'projectDeleted'))
      channel.on('project:joined', dispatch.bind(null, 'joinedProject'))
      channel.on('project:left', dispatch.bind(null, 'leftProject'))

      channel
        .join()
        .receive('ok', msg => {
          _channel = channel
          commit('setNotificationsChannel', channel)
          resolve(msg)
        })
        .receive('error', err => {
          _channel = false
          commit('setNotificationsChannel', channel)
          reject(err)
        })
    })
  },

  disconnectNotificationsChannel({commit}) {
    _channel.leave()
    _channel = false
    commit('setNotificationsChannel', _channel)
  },

  projectUpdated({rootState, commit}, {project, by_user: user}) {
    const current = findProjectById(rootState.projects.projects, project.id)

    if (project) {
      Toast.create.info(`Project ${current.name} updated by ${user.name}`)
      return commit('updateProject', {projectId: project.id, updatedData: project})
    }
  },

  projectDeleted({rootState, commit}, {project_id: id, by_user: user}) {
    const project = findProjectById(rootState.projects.projects, id)

    if (project) {
      Toast.create.warning(`Project ${project.name} deleted by ${user.name}`)
      return commit('removeProject', id)
    }
  },

  joinedProject({commit}, {project}) {
    Toast.create.info(`Joined project ${project.name}`)
    commit('pushProject', project)
  },

  leftProject({rootState, commit}, {project_id: id}) {
    const project = findProjectById(rootState.projects.projects, id)

    if (project) {
      Toast.create.warning(`You where removed from the project ${project.name}`)
    }

    commit('removeProject', id)
  }
}

function findProjectById(projects, id) {
  return projects.find(proj => proj.id === id)
}
