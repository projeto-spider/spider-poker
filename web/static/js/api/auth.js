import {http} from './http'
import {apiRequest} from 'app/utils'

export default {
  me() {
    return apiRequest(
      http.get('/api/sessions')
    )
  },

  signin(username, password) {
    return apiRequest(
      http.post('/api/sessions', {data: {username, password}})
    )
  }
}
