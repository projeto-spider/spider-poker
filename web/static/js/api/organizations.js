import Vue from 'vue'
import {http, resource} from './http'
import parse from './parse'
import {resolveAsJson, resolveErrorAsJson} from 'app/utils'

const organizations = resource('organizations{/id}')

export default {
  all() {
    return organizations.query()
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  create(organization) {
    return organizations.save({}, {data: {attributes: organization}})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  show(name) {
    return organizations.query({'filter[name]': name})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  update(id, attributes) {
    return http.put(`organizations/${id}`, {data: {attributes}})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
  },

  delete(id) {
    return organizations.delete({id})
  },

  projects: {
    all(organizationName) {
      return Vue.http.get(`/api/organizations/${organizationName}/projects`)
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
    }
  },

  members: {
    all(orgId) {
      return http.get(`/api/organizations/${orgId}/users`)
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
    }
  },

  membership: {
    add(orgId, userId) {
      return http.post(`/api/organizations/${orgId}/relationships/users/`, {data: {attributes: {user_id: userId}}})
      .then(resolveAsJson)
      .then(parse)
      .catch(resolveErrorAsJson)
    }
  }
}
