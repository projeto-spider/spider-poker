import {http} from './http'
import {jsonApiRequest} from 'app/utils'

export default {
  me() {
    return jsonApiRequest(
      http.get('/api/sessions')
    )
  },

  signin(username, password) {
    return http.post('/api/sessions', {username, password})
      .then(r => r.json())
  }
}
