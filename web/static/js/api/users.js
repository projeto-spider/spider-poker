import {http, resource} from './http'
import {apiRequest} from 'app/utils'

const users = resource('users{/id}')

export default {
  all() {
    return apiRequest(
      users.query()
    )
  },

  show(username) {
    return apiRequest(
      users.query({'filter[username]': username})
    )
  },

  create(user) {
    return apiRequest(
      users.save({}, {data: {attributes: user}})
    )
  },

  update(id, attributes) {
    return apiRequest(
      http.put(`users/${id}/relationships/profile`, {data: {attributes}})
    )
  },

  delete(id) {
    return users.delete({id})
  },

  notifications: {
    all(username) {
      return apiRequest(
        http.get(`/api/users/${username}/notifications`)
      )
    },

    update(username, id, notification) {
      return apiRequest(
        http.put(`/api/users/${username}/notifications/${id}`, {notification})
      )
    }
  }
}
