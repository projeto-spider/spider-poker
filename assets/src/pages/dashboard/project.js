export default {
  name: 'Project',

  computed: {
    projectId() {
      return this.$route.params.projectId
    }
  }
}
