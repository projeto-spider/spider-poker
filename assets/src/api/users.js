import {http, resource} from './http'
import {request} from 'app/utils'

const users = resource('users{/id}')
const organizations = resource('users{/userId}/organizations{/orgId}')
const projects = resource('users{/userId}/projects{/projId}')

export default {
  all() {
    return request(users.query())
  },

  byId(id) {
    return request(users.get({id}))
  },

  show(username) {
    return request(users.get({id: username}))
  },

  create(user) {
    return request(users.save({}, {data: user}))
  },

  update(id, data) {
    return request(http.put(`users/${id}`, {data}))
  },

  delete(id) {
    return users.delete({id})
  },

  notifications: {
    all(username) {
      return request(http.get(`/api/users/${username}/notifications`))
    },

    update(username, id, notification) {
      return request(
        http.put(`/api/users/${username}/notifications/${id}`, {notification})
      )
    }
  },

  organizations: {
    all(userId) {
      return request(organizations.query({userId}))
    }
  },

  projects: {
    all(userId) {
      return request(projects.query({userId}))
    }
  }
}
