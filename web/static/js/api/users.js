import {http, resource} from './http'
import parse from './parse'
import {resolveAsJson, resolveErrorAsJson} from 'app/utils'

const users = resource('users{/id}')

export default {
  all() {
    return users.query()
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  show(username) {
    return users.query({'filter[username]': username})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  create(user) {
    return users.save({}, {data: {attributes: user}})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  update(id, attributes) {
    return http.put(`users/${id}/relationships/profile`, {data: {attributes}})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  delete(id) {
    return users.delete({id})
  },

  notifications: {
    all(username) {
      return http.get(`/api/users/${username}/notifications`)
        .then(resolveAsJson)
        .catch(resolveErrorAsJson)
    },

    update(username, id, notification) {
      return http.put(`/api/users/${username}/notifications/${id}`, {notification})
        .then(resolveAsJson)
        .catch(resolveErrorAsJson)
    }
  }
}
