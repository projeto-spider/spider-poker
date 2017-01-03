import Vue from 'vue';

export default {
  all() {
    return Vue.http.get('/api/organizations')
      .then(r => r.json());
  },

  show(id) {
    return Vue.http.get(`/api/organizations/${id}`)
      .then(r => r.json());
  },

  projects: {
    all(organizationName) {
      return Vue.http.get(`/api/organizations/${organizationName}/projects`)
        .then(r => r.json());
    },
  },
}
