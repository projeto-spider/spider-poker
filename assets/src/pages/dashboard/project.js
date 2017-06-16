import {Toast, Loading} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'Project',

  props: {
    project: [Object, Boolean]
  },

  data: () => ({
    /* Backlog */
    order: [],
    stories: {},

    /* Adding Story */
    title: '',
    description: ''
  }),

  computed: {
    backlog() {
      return this.order
        .map(id => this.stories[id])
    }
  },

  watch: {
    project() {
      this.projectChanged()
    }
  },

  /*
  *  With hot reloading we keep the state and Vue watcher
  *  doesn't trigger reload stories so I'm using this workaround
  */
  created() {
    if (this.project) {
      this.projectChanged()
    }
  },

  methods: {
    projectChanged() {
      Loading.show({
        message: 'Loading backlog'
      })

      this.order = []
      this.stories = {}

      axios.get(`/projects/${this.project.id}/backlog`)
        .then(this.handleLoadedBacklog)
        .catch(this.handleLoadBacklogFail)
    },

    handleLoadedBacklog(response) {
      Loading.hide()
      this.stories = response.data

      const order = response.meta.order
      // shamelessly push stories with intervals of 50ms
      // just to have a neat enter animation :D
      const interval = setInterval(() => {
        if (!order.length) {
          return clearInterval(interval)
        }

        this.order.push(order.pop())
      }, 50)
    },

    handleLoadBacklogFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to load backlog')
    }
  }
}
