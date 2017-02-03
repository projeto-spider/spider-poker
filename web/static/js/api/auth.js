import {http} from './http'
import parse from './parse'

export default {
  me() {
    return http.get('/api/sessions/me')
      .then(r => r.json())
      .then(parse)
  },

  signin(username, password) {
    return http.post('/api/sessions/create', {username, password})
      .then(r => r.json())
  }
}
