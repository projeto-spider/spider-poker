import Vue from 'vue';

export default {
  all() {
    return Vue.http.get('/api/users')
      .then(r => r.json());
  },

  show(username) {
    return Vue.http.get(`/api/users/${username}`)
      .then(r => r.json());
  },

  notifications: {
    all(username) {
      return Vue.http.get(`/api/users/${username}/notifications`)
        .then(r => r.json());
    },

    update(username, id, notification) {
      return Vue.http.put(`/api/users/${username}/notifications/${id}`, {notification})
        .then(r => r.json());
    },
  },
}
