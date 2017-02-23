import {resource} from './http'
import {apiRequest, snakefy} from 'app/utils'

const projects = resource('projects{/id}')
const members = resource('projects{/projId}/members{/userId}')

export default {
  all() {
    return apiRequest(
      projects.query()
    )
  },

  create(organization) {
    return apiRequest(
      projects.save({}, {data: snakefy(organization)})
    )
  },

  byId(id) {
    return apiRequest(
      projects.get({id})
    )
  },

  show(name) {
    return apiRequest(
      projects.query({'filter[name]': name})
    )
  },

  update(id, attributes) {
    return apiRequest(
      projects.update({id}, {data: snakefy(attributes)})
    )
  },

  delete(id) {
    return projects.delete({id})
  },

  members: {
    all(projId) {
      return apiRequest(
        members.query({projId})
      )
    },

    create(projId, userId, role = 'team') {
      const body = {data: snakefy({userId, role})}

      return apiRequest(
        members.save({projId}, body)
      )
    },

    update(projId, userId, member) {
      const body = {data: snakefy(member)}

      return apiRequest(
        members.update({projId, userId}, body)
      )
    },

    delete(projId, userId) {
      return members.delete({projId, userId})
    }
  }
}
