import R from 'ramda'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import {Gravatar} from 'app/components'
import {Projects} from 'app/api'
import Message from './message'

const STATE = {
  CREATED: 0,
  IDLE: 1,
  VOTING: 2,
  DISCUSSION: 3
}

const padZero = x =>
  `${'0'.repeat(R.clamp(0, 2, 2 - x.toString().length))}${x}`

const emptyVotationModal = {
  open: false,
  time: null,
  erro: false
}

export default {
  name: 'BoardPage',

  components: {Message, Gravatar},

  data: () => {
    const time = Math.trunc((new Date()).getTime() / 1000)

    return {
      STATE,

      now: 0,

      sidebarTab: 1,

      socket: null,
      channel: null,

      deck: [0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', 'Pass', 'Coffee'],

      modalSelectStory: false,

      game: {},

      online: [],

      project: {
        poId: null,
        managerId: null,
        members: [],
      },

      backlog: {
        order: [],
        stories: {}
      },

      message: '',
      messages: []
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    ...mapState({
      token: R.view(R.lensPath(['auth', 'token']))
    }),

    timer() {
      if (!this.game.time ||
          this.game.state === STATE.CREATED ||
          this.game.state === STATE.IDLE)
        return false

      if (this.game.state === STATE.VOTING) {
        if (this.game.time < this.now)
          return false

        const minutes =
          padZero(Math.trunc((this.game.time - this.now) / 60) % 60)

        const seconds =
          padZero((this.game.time - this.now) % 60)

        return {minutes, seconds}
      }

      // TODO: stop using max(0, n) to prevent showing negative timers

      const minutes =
        padZero(R.max(0, Math.trunc((this.now - this.game.time) / 60) % 60))

      const seconds =
        padZero(R.max(0, (this.now - this.game.time) % 60))

      return {minutes, seconds}
    },


    votesColor() {
      const defaultClass = 'is-success'

      if (this.game.state === STATE.VOTING)
        return defaultClass

      if (!this.game.votes)
        return defaultClass

      const cards =
        R.toPairs(this.game.votes)
          .map(R.nth(1))

      if (cards.some(card => card === 'Coffee' || card === 'Pass'))
        return 'is-warning'

      const indexes =
          cards
            .map(card => this.deck.findIndex(R.equals(card)))
            .sort()

      if (indexes.length === 1)
        return defaultClass

      const first = indexes.shift()
      const last = indexes.pop()

      return Math.abs(first - last) > 2
        ? 'is-danger'
        : defaultClass
    },

    users() {
      const userVote = user => {
        if (this.game.state === STATE.VOTING)
          return this.game.votes.includes(user.id)

        return this.game.votes && this.game.votes[user.id]
      }

      return this.project.members
        .map(user => ({
          ...user,
          online: this.online.includes(user.id),
          vote: userVote(user)
        }))
        .sort((left, right) => left.online ? -1 : 1)
    },

    isPo() {
      return this.loggedUser.id === this.project.poId
    },

    isManager() {
      return this.loggedUser.id === this.project.managerId
    },

    stories() {
      return this.backlog.order
        .map(id => ({
          ...this.backlog.stories[id],
          id
        }))
    },

    currentStory() {
      if (!this.game.current_story)
        return false

      return this.stories
        .find(R.propEq('id', this.game.current_story))
    }
  },

  methods: {
    setSidebarTab(id) {
      this.sidebarTab = id
    },

    cardClass(card) {
      return {
        selected: this.selected === card,
        'has-icon': ['Pass', 'Coffee'].includes(card)
      }
    },

    sendMessage() {
      this.channel.push('message', {body: this.message})
      this.message = ''
    },

    // Story selection

    openSelectStoryModal() {
      this.modalSelectStory = true
    },

    closeSelectStoryModal() {
      this.modalSelectStory = false
    },

    selectStory(story) {
      this.channel.push('select_story', story.id)
      this.closeSelectStoryModal()
    },

    // Votation

    startVoting() {
      this.channel.push('start_voting')
    },

    stopVoting() {
      this.channel.push('stop_voting')
    },

    selectCard(card) {
      if (this.game.state === STATE.VOTING) {
        this.selectedCard = card
        return this.channel.push('set_vote', card)
      }

      if (!this.isManager)
        return

      this.channel.push('set_score', card)
    },

    // Time

    tick() {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    },

    // Channel

    channelJoined() {
      const projectName = this.$route.params.project

      // TODO: properly handle errors from these requests

      Projects.backlog(projectName)
        .then(({meta: {order}, data: stories}) => {
          this.backlog.order = order
          this.backlog.stories = stories
        })

      Projects.members.all(projectName)
        .then(({data: members}) => {
          this.project.members = members.map(R.prop('user'))

          const po = members.find(R.propEq('role', 'po'))
          const manager = members.find(R.propEq('role', 'manager'))

          if (po)
            this.project.poId = po.user.id

          if (manager)
            this.project.managerId = manager.user.id
        })
    },

    channelRejected({reason}) {
      if (reason === 'unauthorized')
        return this.$router.replace({name: 'error403'})
      if (reason === 'not found')
        return this.$router.replace({name: 'error404'})
      // TODO: properly tell that things went wrong
      console.error(reason)
    },

    channelMessage({message}) {
      this.messages.unshift({
        ...message,
        user: this.project.members.find(R.propEq('id', message.user_id))
      })
    },

    channelGameState({game}) {
      this.game = game
    },

    channelUserJoined({user}) {
      this.users.push(user)
    },

    channelPresenceState(joins) {
      this.applyJoins(joins)
    },

    channelPresenceDiff({leaves, joins}) {
      this.applyLeaves(leaves)
      this.applyJoins(joins)
    },

    applyLeaves(leaves) {
      R.mapObjIndexed((_user, id) => {
        this.online = R.without([+id], this.online)
      }, leaves)
    },

    applyJoins(joins) {
      R.mapObjIndexed((_user, id) => {
        this.online.push(+id)
      }, joins)
    }
  },

  created() {
    window.setInterval(this.tick, 1000)

    this.socket = new Socket('/socket', {params: {token: this.token}})
    this.socket.connect()

    const projectId = this.$route.params.project
    const channelParams = {}
    this.channel = this.socket.channel(`game:${projectId}`, channelParams)
    this.channel.on("message", this.channelMessage)
    this.channel.on('user_joined', this.channelUserJoined)
    this.channel.on('game_state', this.channelGameState)
    this.channel.on('presence_state', this.channelPresenceState)
    this.channel.on('presence_diff', this.channelPresenceDiff)

    this.channel.join().receive("ok", this.channelJoined)
                       .receive("error", this.channelRejected)
  },

  beforeDestroy() {
    clearInterval(this.tick)
    this.channel.leave()
  }
}
