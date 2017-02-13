import {http, resource} from './http'
import {jsonApiRequest} from 'app/utils'

const users = resource('users{/id}')

export default {
  all() {
    return jsonApiRequest(
      users.query()
    )
  },

  show(username) {
    return jsonApiRequest(
      users.query({'filter[username]': username})
    )
  },

  create(user) {
    return jsonApiRequest(
      users.save({}, {data: {attributes: user}})
    )
  },

  update(id, attributes) {
    return jsonApiRequest(
      http.put(`users/${id}/relationships/profile`, {data: {attributes}})
    )
  },

  delete(id) {
    return users.delete({id})
  },

  notifications: {
    all(username) {
      return jsonApiRequest(
        http.get(`/api/users/${username}/notifications`)
      )
    },

    update(username, id, notification) {
      return jsonApiRequest(
        http.put(`/api/users/${username}/notifications/${id}`, {notification})
      )
    }
  }
}
