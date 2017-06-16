import {Toast, Loading} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import axios from 'utils/axios'

export default {
  name: 'Project',

  props: {
    project: [Object, Boolean]
  },

  data: () => ({
    /* Socket */
    socket: false,
    channel: false,

    /* Backlog */
    order: [],
    stories: {},

    /* Adding Story */
    title: '',
    description: ''
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    ...mapState({
      token: state => state.auth.token
    }),

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
      this.order = []
      this.stories = {}

      if (!this.socket) {
        this.socket = new Socket('/socket', {params: {token: this.token}})
        this.socket.connect()
      }

      if (this.channel) {
        this.channel.leave()
      }

      this.channelConnect()
    },

    /* Socket Connection */
    channelConnect() {
      Loading.show({
        message: 'Connecting to server',
        delay: 0
      })

      const projectId = this.project.id
      const channelName = `backlog:${projectId}`
      const channelParams = {}
      this.channel = this.socket.channel(channelName, channelParams)

      this.channel.on('unshift_story', this.channelUnshiftStory)

      this.channel
        .join()
        .receive('ok', this.channelJoined)
        .receive('error', this.channelRejected)
    },

    channelJoined() {
      Loading.hide()
      this.loadBacklog()
    },

    channelRejected(reason) {
      Loading.hide()

      if (reason === 'unauthorized')
        return Toast.create.negative('Unauthorized to join at backlog server')

      if (reason === 'not found')
        return Toast.create.negative('Backlog server not found')
    },

    /* Backlog Loading */
    loadBacklog() {
      Loading.show({
        message: 'Loading backlog',
        delay: 0
      })

      axios.get(`/projects/${this.project.id}/backlog`)
        .then(this.handleLoadedBacklog)
        .catch(this.handleLoadBacklogFail)
    },

    handleLoadedBacklog(response) {
      Loading.hide()
      this.stories = response.data

      const order = response.meta.order.reverse()
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
    },

    /* Unshift Story */
    unshiftStory() {
      if (this.title === '') {
        return
      }

      const {title, description} = this
      this.title = ''
      this.description = ''

      this.channel.push('unshift_story', {title, description})
    },

    channelUnshiftStory({story, order}) {
      this.stories[story.id] = story
      this.order = order
    }
  }
}
