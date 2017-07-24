import {Toast, Loading, AppFullscreen} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import axios from 'utils/axios'
import {STATE} from 'utils/enums'
import Gravatar from 'components/gravatar.vue'
import GameStory from 'components/story/game-story.vue'
import UserPresence from 'components/user-presence.vue'
import Timer from './timer.vue'
import Message from './chat/message.vue'
import MessageInput from './chat/message-input.vue'

const {CREATED, IDLE, VOTING, DISCUSSION} = STATE

export default {
  name: 'Game',

  components: {Gravatar, GameStory, Timer, UserPresence, Message, MessageInput},

  data: () => ({
    /* Socket */
    socket: false,
    channel: false,

    /* Selected Card */
    selectedCard: false,

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

    /* Tracks what happens during the game */
    events: [],

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

    /* Stories to Create */
    substories: [''],

    /* Chat */
    anonymous: false,
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
        .map(id => Object.assign({
          children: this.stories[id].backlog.map(child => this.stories[child])
        }, this.stories[id]))
    },

    /* Membership */
    role() {
      const membership = this.users[this.loggedUser.id]
      return membership
        ? membership.role
        : 'team'
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
      this.channel.on('track', this.channelTrack)
      this.channel.on('message', this.channelMessage)
      this.channel.on('added_substories', this.channelAddedSubstories)
      this.channel.on('story_updated', this.channelStoryUpdated)
      this.channel.on('presence_state', this.channelPresenceState)
      this.channel.on('presence_diff', this.channelPresenceDiff)
      this.channel.on('game_finished', this.channelGameFinished)

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

    /* Message Passing */
    sendMessage(message) {
      this.channel.push('message', {anonymous: this.anonymous, body: message})
    },

    /* Select Story */
    selectStory(story) {
      this.channel.push('select_story', story.id)
    },

    /* Voting */
    startVoting() {
      this.channel.push('start_voting')
    },

    stopVoting() {
      this.channel.push('stop_voting')
    },

    selectCard(card) {
      if (this.voting) {
        this.selectedCard = card
        return this.channel.push('set_vote', card)
      }

      if (!this.role === 'manager') {
        return
      }

      this.channel.push('set_score', card)
    },

    /* Create Substories */
    createSubstories() {
      this.channel.push('create_substories', {stories: this.substories})
      this.substories = ['']
    },

    /* Finish Game */
    finishGame() {
      this.channel.push('finish_game')
    },

    /* Put in the log the selected story */
    logChangedStory(id) {
      const story = this.stories[id]

      if (!id || !story) {
        return
      }

      const storageKey = `chat-${this.projectId}`
      const log = localStorage.getItem(storageKey) || ''

      const nextLine = `**Selected Story "${story.title}"**`

      localStorage.setItem(storageKey, `${log}${nextLine}\n`)
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
      // Reset selected card when a new voting start
      if (this.state !== game.state) {
        this.selectedCard = false
      }

      if (this.state.current_story !== game.current_story) {
        this.logChangedStory(game.current_story)
      }

      Object.assign(this, game)
    },

    channelTrack(payload) {
      this.events.unshift(payload)
    },

    channelStoryUpdated({story}) {
      this.stories = {
        ...this.stories,
        [story.id]: story
      }
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

      const storageKey = `chat-${this.projectId}`
      const log = localStorage.getItem(storageKey) || ''

      const nextLine = message.user_id === 0
        ? `Anonymous: ${message.body}`
        : `${this.users[message.user_id].display_name}: ${message.body}`

      localStorage.setItem(storageKey, `${log}${nextLine}\n`)
    },

    channelPresenceDiff({leaves, joins}) {
      // TODO: handle multiple devices properly
      const joinsIds = Object.keys(joins).map(Number)
      const leavesIds = Object.keys(leaves).map(Number)

      const next = [...this.onlineIds].concat(joinsIds)

      leavesIds.forEach(id => {
        const index = next.findIndex(idX => idX === id)

        if (index !== -1) {
          next.splice(index, 1)
        }
      })

      this.onlineIds = next
    },

    channelAddedSubstories({order, stories}) {
      this.stories =
        stories.reduce((acc, story) =>
          Object.assign(acc, {[story.id]: story}),
          Object.assign({}, this.stories)
        )

      this.stories[this.current_story].backlog = order
    },

    channelGameFinished() {
      this.$router.push({name: 'Dashboard'})
    },

    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    },

    downloadChat() {
      const element = document.createElement('a')
      const text = localStorage.getItem(`chat-${this.projectId}`) || ''
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', `chat-${this.projectId}.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },

    clearChat() {
      this.messages = []
      localStorage.setItem(`chat-${this.projectId}`, '')
      Toast.create.positive('Chat cleared')
    }
  }
}
