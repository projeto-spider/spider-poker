import axios from 'utils/axios'

export const state = {
  projects: [],
  selectedProjectId: false
}

export const mutations = {
  projectsSynced(state, projects) {
    state.projects = projects
  },

  selectProject(state, projectId) {
    state.selectedProjectId = projectId
    localStorage.setItem('lastProjectId', projectId)
  },

  pushProject(state, project) {
    state.projects.push(project)
  },

  updateProject(state, {projectId: updatedId, updatedData}) {
    state.projects = state.projects.map(proj =>
      proj.id === updatedId
        ? updatedData
        : proj
    )
  },

  removeProject(state, projectId) {
    state.projects = state.projects.filter(proj => proj.id !== projectId)
  }
}

export const getters = {
  projects(state) {
    return state.projects
  },

  selectedProject(state) {
    const index = state.projects
      .findIndex(proj => proj.id === state.selectedProjectId)

    return index !== -1 ? state.projects[index] : false
  }
}

export const actions = {
  async syncProjects({state, commit}) {
    const {data: projects} = await axios.get('/projects')
    commit('projectsSynced', projects)

    /*
     * On the first page load (when there's no project selected)
     * If there where a project selected last time
     * And this project is in the list
     * Select it.
     */
    if (state.selectedProjectId) return

    const lastProjectId = localStorage.getItem('lastProjectId')
    if (lastProjectId && projects.some(proj => proj.id === lastProjectId)) {
      commit('selectProject', lastProjectId)
    }
  },

  async createProject({commit}, data) {
    const {data: project} = await axios.post('/projects', {data})
    return commit('pushProject', project)
  },

  async updateProject({commit}, {projectId, data}) {
    const {data: updatedData} = await axios.put(`/projects/${projectId}`, {data})
    return commit('updateProject', {projectId, updatedData})
  },

  async deleteProject({commit}, projectId) {
    await axios.delete(`/projects/${projectId}`)
    return commit('removeProject', projectId)
  },

  async leaveProject({rootState, commit}, projectId) {
    const userId = rootState.auth.user.id
    await axios.delete(`/projects/${projectId}/members/${userId}`)
    return commit('removeProject', projectId)
  }
}
