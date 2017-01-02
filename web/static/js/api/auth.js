import Vue from 'vue';

export default {
  me() {
    return Vue.http.get('/api/sessions/me')
      .then(r => r.json());
  },

  signin(username, password) {
    return Vue.http.post('/api/sessions/create', {username, password})
      .then(r => r.json());
  },

  signup(user) {
    return Vue.http.post('/api/users', {user})
      .then(r => r.json());
  },
}
