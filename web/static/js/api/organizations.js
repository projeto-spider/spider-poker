import {resource} from './http'
import {jsonApiRequest, snakefy} from 'app/utils'

const organizations = resource('organizations{/id}')
const members = resource('organizations{/orgId}/relationships/members{/userId}')

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
      organizations.update({id}, {data: {attributes: snakefy(attributes)}})
    )
  },

  delete(id) {
    return organizations.delete({id})
  },

  members: {
    all(orgId) {
      return jsonApiRequest(
        members.query({orgId})
      )
    },

    create(orgId, userId, role = 'member') {
      const body = {data: {attributes: snakefy({userId, role})}}

      return jsonApiRequest(
        members.save({orgId}, body)
      )
    },

    update(orgId, userId, member) {
      const body = {data: {attributes: snakefy(member)}}

      return jsonApiRequest(
        members.update({orgId, userId}, body)
      )
    },

    delete(orgId, userId) {
      return members.delete({orgId, userId})
    }
  }
}
