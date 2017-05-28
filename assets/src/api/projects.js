import {resource} from './http'
import {request, snakefy} from 'app/utils'

const projectCustomActions = {
  backlog: {
    method: 'GET',
    url: 'projects{/id}/backlog'
  }
}
const projects = resource('projects{/id}', {}, projectCustomActions)
const members = resource('projects{/projId}/members{/userId}')

export default {
  all() {
    return request(projects.query())
  },

  create(data) {
    return request(projects.save({}, {data: snakefy(data)}))
  },

  byId(id) {
    return request(projects.get({id}))
  },

  show(name) {
    return request(projects.query({'filter[name]': name}))
  },

  update(id, attributes) {
    return request(projects.update({id}, {data: snakefy(attributes)}))
  },

  delete(id) {
    return projects.delete({id})
  },

  backlog(id) {
    return request(projects.backlog({id}))
  },

  members: {
    all(projId) {
      return request(members.query({projId}))
    },

    create(projId, userId, role = 'team') {
      const body = {data: snakefy({userId, role})}

      return request(members.save({projId}, body))
    },

    update(projId, userId, member) {
      const body = {data: snakefy(member)}

      return request(members.update({projId, userId}, body))
    },

    delete(projId, userId) {
      return members.delete({projId, userId})
    }
  }
}
