import Vue from 'vue';

export default {
  all() {
    return Vue.http.get('/api/organizations')
      .then(r => r.json());
  },
}
