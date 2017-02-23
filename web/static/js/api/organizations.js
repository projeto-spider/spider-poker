import {resource} from './http'
import {apiRequest, snakefy} from 'app/utils'

const organizations = resource('organizations{/id}')
const members = resource('organizations{/orgId}/members{/userId}')
const projects = resource('organizations{/orgId}/projects{/projId}')

export default {
  all() {
    return apiRequest(
      organizations.query()
    )
  },

  create(organization) {
    return apiRequest(
      organizations.save({}, {data: snakefy(organization)})
    )
  },

  show(name) {
    return apiRequest(
      organizations.query({'filter[name]': name})
    )
  },

  update(id, attributes) {
    return apiRequest(
      organizations.update({id}, {data: snakefy(attributes)})
    )
  },

  delete(id) {
    return organizations.delete({id})
  },

  members: {
    all(orgId) {
      return apiRequest(
        members.query({orgId})
      )
    },

    create(orgId, userId, role = 'member') {
      const body = {data: snakefy({userId, role})}

      return apiRequest(
        members.save({orgId}, body)
      )
    },

    update(orgId, userId, member) {
      const body = {data: snakefy(member)}

      return apiRequest(
        members.update({orgId, userId}, body)
      )
    },

    delete(orgId, userId) {
      return members.delete({orgId, userId})
    }
  },

  projects: {
    all(orgId) {
      return apiRequest(
        projects.query({orgId})
      )
    },

    create(orgId, data) {
      const body = {data: snakefy(data)}

      return apiRequest(
        projects.save({orgId}, body)
      )
    },

    update(orgId, projId, data) {
      const body = {data: snakefy(data)}

      return apiRequest(
        projects.update({orgId, projId}, body)
      )
    },

    delete(orgId, projId) {
      return projects.delete({orgId, projId})
    }
  }
}
