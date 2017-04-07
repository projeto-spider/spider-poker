import {resource} from './http'
import {request, snakefy} from 'app/utils'

const organizations = resource('organizations{/id}')
const members = resource('organizations{/orgId}/members{/userId}')
const projects = resource('organizations{/orgId}/projects{/projId}')

export default {
  all() {
    return request(organizations.query())
  },

  create(data) {
    return request(organizations.save({}, {data: snakefy(data)}))
  },

  byId(id) {
    return request(organizations.get({id}))
  },

  show(name) {
    return request(organizations.query({'filter[name]': name}))
  },

  update(id, attributes) {
    return request(organizations.update({id}, {data: snakefy(attributes)}))
  },

  delete(id) {
    return organizations.delete({id})
  },

  members: {
    all(orgId) {
      return request(members.query({orgId}))
    },

    create(orgId, userId, role = 'member') {
      const body = {data: snakefy({userId, role})}

      return request(members.save({orgId}, body))
    },

    update(orgId, userId, member) {
      const body = {data: snakefy(member)}

      return request(members.update({orgId, userId}, body))
    },

    delete(orgId, userId) {
      return members.delete({orgId, userId})
    }
  },

  projects: {
    all(orgId) {
      return request(projects.query({orgId}))
    },

    create(orgId, data) {
      const body = {data: snakefy(data)}

      return request(projects.save({orgId}, body))
    },

    update(orgId, projId, data) {
      const body = {data: snakefy(data)}

      return request(projects.update({orgId, projId}, body))
    },

    delete(orgId, projId) {
      return projects.delete({orgId, projId})
    }
  }
}
