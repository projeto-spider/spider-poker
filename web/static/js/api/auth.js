import {http} from './http'
import {jsonApiRequest} from 'app/utils'

export default {
  me() {
    return jsonApiRequest(
      http.get('/api/sessions/me')
    )
  },

  signin(username, password) {
    return http.post('/api/sessions/create', {username, password})
      .then(r => r.json())
  }
}
