import Vue from 'vue'
import VueResource from 'vue-resource'
import store from 'app/store'

Vue.use(VueResource)

Vue.http.options.root = '/api'
Vue.http.headers.common['accept'] = 'application/vnd.api+json'
Vue.http.headers.common['content-type'] = 'application/vnd.api+json'

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', store.state.auth.token)
  next()
})

const {resource, http} = Vue

export {resource, http}
