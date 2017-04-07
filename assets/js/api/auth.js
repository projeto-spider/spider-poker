import {http} from './http'
import {request} from 'app/utils'

export default {
  me() {
    return request(http.get('/api/sessions'))
  },

  signin(username, password) {
    return request(http.post('/api/sessions', {data: {username, password}}))
  }
}
