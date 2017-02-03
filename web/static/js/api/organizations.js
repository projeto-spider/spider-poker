import Vue from 'vue'
import {http, resource} from './http'
import parse from './parse'

const organizations = resource('organizations{/id}')

export default {
  all() {
    return Vue.http.get('/api/organizations')
      .then(r => r.json())
  },

  create(organization) {
    return organizations.save({}, {data: {attributes: organization}})
      .then(r => r.json())
      .then(parse)
  },

  show(name) {
    return organizations.query({'filter[name]': name})
      .then(r => r.json())
      .then(parse)
  },

  update(id, attributes) {
    return http.put(`organizations/${id}`, {data: {attributes}})
      .then(r => r.json())
      .then(parse)
  },

  delete(id) {
    return organizations.delete({id})
  },

  projects: {
    all(organizationName) {
      return Vue.http.get(`/api/organizations/${organizationName}/projects`)
        .then(r => r.json())
    }
  }
}
