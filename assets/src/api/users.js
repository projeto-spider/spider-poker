import {http, resource} from './http'
import {request} from 'app/utils'

const users = resource('users{/id}')

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
    return request(http.put(`users/${id}/profile`, {data}))
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
  }
}
