import {Toast, Loading} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'Project',

  data: () => ({
    /* Backlog */
    order: [],
    stories: {},

    /* Adding Story */
    title: '',
    description: ''
  }),

  computed: {
    projectId() {
      return this.$route.params.projectId
    },

    backlog() {
      return this.order
        .map(id => this.stories[id])
    }
  },

  created() {
    Loading.show({
      message: 'Loading backlog'
    })

    axios.get(`/projects/${this.projectId}/backlog`)
      .then(this.handleLoadedBacklog)
      .catch(this.handleLoadBacklogFail)
  },

  methods: {
    handleLoadedBacklog(response) {
      Loading.hide()
      this.order = response.meta.order
      this.stories = response.data
    },

    handleLoadBacklogFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to load backlog')
    }
  }
}
