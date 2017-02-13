import {http, resource} from './http'
import {jsonApiRequest, snakefy} from 'app/utils'

const organizations = resource('organizations{/id}')

export default {
  all() {
    return jsonApiRequest(
      organizations.query()
    )
  },

  create(organization) {
    return jsonApiRequest(
      organizations.save({}, {data: {attributes: snakefy(organization)}})
    )
  },

  show(name) {
    return jsonApiRequest(
      organizations.query({'filter[name]': name})
    )
  },

  update(id, attributes) {
    return jsonApiRequest(
      http.put(`organizations/${id}`, {data: {attribute: snakefy(attributes)}})
    )
  },

  delete(id) {
    return organizations.delete({id})
  },

  members: {
    all(orgId) {
      return jsonApiRequest(
        http.get(`/api/organizations/${orgId}/memberships/users`)
      )
    },

    create(userId, orgId, role = 'member') {
      const opts = {data: {attributes: snakefy({userId, role})}}

      return jsonApiRequest(
        http.post(`/api/organizations/${orgId}/memberships/users`, opts)
      )
    }
  }
}
