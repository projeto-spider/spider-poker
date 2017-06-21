import {Toast, Loading, AppFullscreen} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'

/*
 * State Enum
 * Replicates the server Enum.
 * See: Poker.Web.Game
 */
const CREATED = 0
const IDLE = 1
const VOTING = 2
const DISCUSSION = 3

export default {
  name: 'Game',

  components: {Gravatar},

  data: () => ({
    /* Socket */
    socket: false,
    channel: false,

    /*
     * Game
     * This mimicks the server Poker.Web.Game module
     * therefore we have snake_cased data.
     */
    state: 0,
    current_story: false,
    scores: {},
    time: false,
    votes: {},

    /*
     * Presence
     * Users works like a database to cache user data
     * instead of receiving everytime we receive messages
     * and other things.
     * Users start false to not render anything on the template
     * Online and offline state are computed values.
     */
    users: false,
    onlineIds: [],
    offlineIds: [],

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
    },

    /* Membership */
    role() {
      const membership = this.users[this.loggedUser.id]
      return membership.role || 'team'
    },

    /* Presence */
    online() {
      return this.onlineIds
        .map(id => this.users[id])
    },

    offline() {
      return Object.values(this.users)
        .filter(user => !this.onlineIds.includes(user.id))
    },

    /* State helpers */
    created() {
      return this.state === CREATED
    },

    idle() {
      return this.state === IDLE
    },

    voting() {
      return this.state === VOTING
    },

    discussion() {
      return this.state === DISCUSSION
    }
  },

  created() {
    this.connectToGame()
  },

  beforeDestroy() {
    if (this.channel) {
      this.channel.leave()
    }
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
      this.channel.on('presence_state', this.channelPresenceState)
      this.channel.on('presence_diff', this.channelPresenceDiff)

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
      this.users = response.data.reduce((acc, member) =>
        Object.assign(acc, {
          [member.user.id]: {
            ...member.user,
            // useful for tests later
            role: member.role
          }
        })
      , {})
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

      Toast.create.negative('Failed to connect to game server')
    },

    channelGameState({game}) {
      Object.assign(this, game)
    },

    channelMessage(message) {
      this.messages.push(message)
    },

    channelPresenceState(joins) {
      this.channelPresenceDiff({joins, leaves: {}})
    },

    channelMessage({message}) {
      this.messages.push(message)

      const ref = this.$refs['layout-view']
      ref.scrollTop = ref.scrollHeight
      const ref2 = this.$refs['layout-padding']
      ref2.scrollTop = ref2.scrollHeight
    },

    channelPresenceDiff({leaves, joins}) {
      const joinsIds = Object.keys(joins).map(Number)
      const leavesIds = Object.keys(leaves).map(Number)

      this.onlineIds = this.onlineIds
        .filter(id => !leavesIds.some(idB => idB === id))
        .concat(joinsIds)
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
