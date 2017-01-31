import {http, resource} from './http'
import parse from './parse'
import parseErrors from './parse-errors'

const users = resource('users{/id}')

export default {
  all() {
    return users.query()
      .then(res => res.json())
      .then(parse)
  },

  show(username) {
    return users.query({'filter[username]': username})
      .then(r => r.json())
      .then(parse)
  },

  create(user) {
    return users.save({}, {data: {attributes: user}})
      .then(r => r.json())
      .then(parse)
  },

  update(id, attributes) {
    return http.put(`users/${id}/relationships/profile`, {data: {attributes}})
      .then(r => r.json())
      .then(parse)
  },

  delete(id) {
    return users.delete({id})
  },

  notifications: {
    all(username) {
      return Vue.http.get(`/api/users/${username}/notifications`)
        .then(r => r.json());
    },

    update(username, id, notification) {
      return Vue.http.put(`/api/users/${username}/notifications/${id}`, {notification})
        .then(r => r.json());
    },
  },
}
