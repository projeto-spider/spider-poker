import {Toast, Loading} from 'quasar'
import axios from 'utils/axios'
import {STATE} from 'utils/enums'
import {mapGetters, mapMutations} from 'vuex'
import {Presence} from 'phoenix'

export default {
  name: 'BacklogChannel',

  data: () => ({
    /* Socket */
    channel: false,
    presence: {},

    /* Game state */
    game: false,

    /* Messages */
    chat: [],

    /*
     * Story local DB
     * It's useful when the order changes and we need
     * to rebuild the backlog
     */
    stories: {},
    /* Backlog */
    backlog: [],
    /* Members */
    members: {}
  }),

  /*
   * With hot reloading we keep the state and Vue watcher
   * doesn't trigger reload stories so I'm using this workaround
   */
  created() {
    if (this.project) {
      this.projectChanged()
    }
  },

  watch: {
    project() {
      this.projectChanged()
    }
  },

  computed: {
    ...mapGetters(['loggedUser', 'socketConnected', 'socket', 'inGame']),
    ...mapGetters({
      project: 'selectedProject'
    }),

    onlineMembers() {
      return Object.keys(this.presence)
        .map(id => {
          if (!this.members[id]) {
            this.syncMembers()
          }

          return this.members[id] || null
        })
    },

    offlineMembers() {
      const onlineIds = Object.keys(this.presence)
      return Object.values(this.members)
        .filter(({id}) => !onlineIds.includes(id))
    },

    created() {
      return this.game && this.game.state === STATE.CREATED
    },

    voting() {
      return this.game && this.game.state === STATE.VOTING
    },

    discussion() {
      return this.game && this.game.state === STATE.DISCUSSION
    }
  },

  methods: {
    ...mapMutations(['updateProject']),

    projectChanged() {
      this.channelConnect()
    },

    syncBacklog() {
      Loading.show({
        message: 'Loading backlog'
      })

      axios.get(`/projects/${this.project.id}/backlog`)
        .then(({data: backlog}) => {
          Loading.hide()

          this.stories = backlog.reduce((acc, story) => {
            acc[story.id] = story

            story.children.forEach(child => {
              acc[child.id] = child
            })

            return acc
          }, {})

          this.backlog = []

          const toPush = backlog.reverse()
          // shamelessly push stories with intervals of 50ms
          // just to have a neat enter animation :D
          const interval = setInterval(() =>
            toPush.length
              ? this.backlog.push(toPush.pop())
              : clearInterval(interval)
          , 50)
        })
        .catch(() => {
          Loading.hide()
          Toast.create.negative('Failed to load backlog')
        })
    },

    syncMembers() {
      axios.get(`/projects/${this.project.id}/members`)
        .then(({data: members}) => {
          this.members = members.reduce((acc, member) => {
            acc[member.id] = member
            return acc
          }, {})
        })
    },

    syncGame() {
      if (!this.inGame) {
        return
      }

      this.channel.push('game:get')
    },

    channelConnect() {
      if (!this.socketConnected) {
        return setTimeout(this.channelConnect, 500)
      }

      const projectId = this.project.id
      const topic = `project:${projectId}`
      const params = {}

      /* Already in a channel */
      if (this.channel) {
        /* If it's the same topic, no need to reconnect */
        if (this.channel.topic === topic) {
          return
        }
        /* Otherwise leave the current one */
        this.channel.leave()
      }

      Loading.show({
        message: 'Connecting to project server'
      })

      this.channel = this.socket.channel(topic, params)

      this.channel.on('story:created', this.channelStoryCreated)
      this.channel.on('story:updated', this.channelStoryUpdated)
      this.channel.on('story:deleted', this.channelStoryDeleted)
      this.channel.on('story:moved', this.channelOrderChange)

      this.channel.on('order:change', this.channelOrderChange)

      this.channel.on('substory:created', this.channelSubstoryCreated)
      this.channel.on('substory:deleted', this.channelSubstoryDeleted)
      this.channel.on('substory:moved', this.channelSubstoryMoved)

      this.channel.on('game:state', this.channelGameState)
      this.channel.on('game:start', this.channelGameStart)
      this.channel.on('game:stop', this.channelGameStop)
      this.channel.on('game:state', this.channelGameState)
      this.channel.on('game:message', this.channelGameMessage)

      this.channel.on('presence_state', this.channelPresenceState)
      this.channel.on('presence_diff', this.channelPresenceDiff)

      this.channel.on('error', this.channelError)

      this.channel
        .join()
        .receive('ok', () => {
          Loading.hide()
          this.syncBacklog()
          this.syncMembers()
          this.syncGame()
        })
        .receive('error', ({reason}) => {
          Loading.hide()

          if (reason === 'unauthorized') {
            return Toast.create.negative('Unauthorized to join at this project server')
          }

          if (reason === 'not found') {
            return Toast.create.negative('Failed to connect to this project server')
          }
        })
    },

    channelStoryCreated({story, order}) {
      this.stories[story.id] = story
      this.backlog = order.map(id => this.stories[id])
    },

    channelStoryUpdated({story}) {
      this.stories[story.id] = story
      this.backlog = this.backlog.map(s =>
        s.id === story.id
          ? story
          : {
            ...s,
            children: s.children.map(child =>
              child.id === story.id
                ? story
                : child
            )
          }
      )
    },

    channelStoryDeleted({order, story_id: id}) {
      this.stories[id] = null
      this.backlog = order.map(id => this.stories[id])
    },

    channelOrderChange({order}) {
      this.backlog = order.map(id => this.stories[id])
    },

    channelSubstoryCreated({parent_id, story, order}) {
      this.stories[story.id] = story
      this.stories[parent_id].children = order.map(id => this.stories[id])
      this.$ga.event('Story', 'Decompose', 'Decomposed story')
    },

    channelSubstoryDeleted({parent_id, story_id, order}) {
      this.stories[parent_id].children = order.map(id => this.stories[id])
      this.stories[story_id] = null
    },

    channelSubstoryMoved({parent_id, order}) {
      this.stories[parent_id].children = order.map(id => this.stories[id])
    },

    channelGameStart({project, game}) {
      this.updateProject({projectId: project.id, updatedData: project})
      this.game = game
    },

    channelGameStop() {
      const updatedData = Object.assign({}, this.project, {current_game: false})
      this.updateProject({projectId: this.project.id, updatedData})
      this.chat = []
    },

    channelGameState({game}) {
      this.game = game
    },

    channelGameMessage({message: {body, user_id}}) {
      this.chat.unshift({
        body, user: this.members[user_id]
      })
    },

    channelPresenceState(state) {
      this.presence = Presence.syncState(this.presence, state)
    },

    channelPresenceDiff(diff) {
      this.presence = Presence.syncDiff(this.presence, diff)
    },

    channelError({reason}) {
      Toast.create.negative(reason)
    }
  }
}
