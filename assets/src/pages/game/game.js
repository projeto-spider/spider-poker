import {Toast, Loading, AppFullscreen} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'Game',

  components: {Gravatar},

  data: () => ({
    /* Socket */
    socket: false,
    channel: false,

    /* Chat */
    messages: [],
    message: '',

    /* Backlog */
    order: [],
    stories: {}
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    ...mapState({
      token: state => state.auth.token
    }),

    projectId() {
      return +this.$route.params.projectId
    },

    backlog() {
      return this.order
        .map(id => this.stories[id])
    }
  },

  created() {
    this.connectToGame()
  },

  watch: {
    // Just in case someone change the URL ¯\_(ツ)_/¯
    projectId() {
      this.connectToGame()
    }
  },

  methods: {
    /* connectToGame */
    connectToGame() {
      Loading.show({
        message: 'Connecting to server',
        delay: 0
      })

      if (!this.socket) {
        this.socket = new Socket('/socket', {params: {token: this.token}})
        this.socket.connect()
      }

      if (this.channel) {
        this.channel.leave()
      }

      const channelName = `game:${this.projectId}`
      const channelParams = {}
      this.channel = this.socket.channel(channelName, channelParams)

      this.channel.on('game_state', this.channelGameState)
      this.channel.on('message', this.channelMessage)

      this.channel.join()
        .receive('ok', this.channelJoined)
        .receive('error', this.channelRejected)
    },

    /* Initial Data Loads */
    loadMembers() {
      axios.get(`/projects/${this.projectId}/members`)
        .then(this.membersLoaded)
        .catch(this.membersLoadFail)
    },

    membersLoaded(response) {
      this.members = response.data
    },

    membersLoadFail(_error) {
      Toast.create.negative('Failed to load members')
    },

    loadBacklog() {
      axios.get(`/projects/${this.projectId}/backlog`)
        .then(this.backlogLoaded)
        .catch(this.backlogLoadFail)
    },

    backlogLoaded(response) {
      this.order = response.meta.order
      this.stories = response.data
    },

    backlogLoadFail(_error) {
      Toast.create.negative('Failed to load backlog')
    },

    /* Channel Events */
    channelJoined() {
      Loading.hide()
      Loading.show({
        message: 'Loading data',
        delay: 0
      })

      Promise.all([this.loadMembers(), this.loadBacklog()])
        .then(Loading.hide)
    },

    channelRejected({reason}) {
      Loading.hide()

      if (reason === 'unauthorized') {
        return Toast.create.negative('Unauthorized to join at game server')
      }

      if (reason === 'not found') {
        return Toast.create.negative('Project not found')
      }

      console.log({reason})
      Toast.create.negative('Failed to connect to game server')
    },

    channelGameState({game}) {
      Object.assign(this, game)
    },

    channelMessage(message) {
      this.messages.push(message)
    },

    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    }
  }
}
