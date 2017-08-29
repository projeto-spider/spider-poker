import axios from 'axios'
import store from 'store'

const baseURL = DEV ? 'http://0.0.0.0:4000/api' : '/api'

const instance = axios.create({
  baseURL,

  validateStatus(status) {
    return status >= 200 && status < 300
  }
})

instance.interceptors.request.use(putAuthToken)
instance.interceptors.response.use(mergeRedundantData)

export default instance

/*
*  Inject from store the user token
*/
function putAuthToken(request) {
  request.headers.common['Authorization'] = store.state.auth.token
  return request
}

/*
*  Axios use the key "data" to put the parsed JSON.
*  Our API also uses "data" to store the main content.
*  Our API also has the key "meta" for things like pagination.
*/
function mergeRedundantData(response) {
  if (response.data && response.data.data) {
    return Object.assign(response, response.data)
  }

  return response
}
