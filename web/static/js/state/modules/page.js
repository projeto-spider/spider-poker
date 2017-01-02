const state = {
  title: null,
  description: null,
};

const mutations = {
  set(state, {title, description = null}) {
    state.title = title;
    state.description = description;
  },
};

export default {
  namespaced: 'true',
  state,
  mutations
}
