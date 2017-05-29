import R from 'ramda'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import {Gravatar} from 'app/components'
import {Projects} from 'app/api'
import Message from './message'

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
      start: time,
      now: time,
      voteTimer: 0,
      discussionTimer: 0,
      sidebarTab: 1,
      socket: null,
      channel: null,
      selected: null,
      deck: [0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', 'Pass', 'Coffee'],
      votes: [
        {username: 'foobar', displayName: 'Foobar', when: '31s', voted: 1},
        {username: 'bazbar', displayName: 'Bazbar', when: '45s', voted: 13},
        {username: 'quxbar', displayName: 'Quxbar', when: '1m', voted: 40}
      ],

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
      messages: [],
      picked: [],
      options: [],
      onGoing: false,
      modal: {
        votation: emptyVotationModal
      },
      open: false,
      votation: false
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    ...mapState({
      token: R.view(R.lensPath(['auth', 'token']))
    }),

    timePassed() {
      return {
        seconds: (this.now - this.start) % 60,
        minutes: Math.trunc((this.now - this.start) / 60) % 60
      }
    },

    discussionTimePassed() {
      if (this.discussionTimer !== 0) {
        return {
          seconds: (this.now - this.discussionTimer) % 60,
          minutes: Math.trunc((this.now - this.discussionTimer) / 60) % 60
        }
      }
    },

    votationTimePassed() {
      if (this.voteTimer !== 0) {
        do {
          return {
            seconds: (this.voteTimer - this.now) % 60,
            minutes: Math.trunc((this.voteTimer - this.now) / 60) % 60
          }
        } while (this.votationTimePassed.seconds > 0)
      }
    },

    users() {
      return this.project.members
        .map(user => ({
          ...user,
          online: this.online.includes(user.id)
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
    padZero(x, n = 2) {
      const asStr = x.toString()
      return `${'0'.repeat(n - asStr.length)}${asStr}`
    },

    setSidebarTab(id) {
      this.sidebarTab = id
    },

    select(card) {
      this.selected = card
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

    openVotationModal() {
      this.modal.votation.open = true
    },

    VotationTimer() {
      var valid = /^\d*$/.test(this.modal.votation.time)

      if (valid) {
        this.voteTimer = (parseFloat(this.modal.votation.time) * 60) + Math.trunc((new Date()).getTime() / 1000)
        this.modal.votation.open = false
        this.modal.votation.time = null
        this.votation = true
      } else {
        this.modal.votation.erro = true
        this.modal.votation.time = null
      }
      console.log(this.votationTimePassed.seconds)
    },

    closeVotationModal() {
      this.modal.votation = {
        ...emptyVotationModal,
        open: false,
        erro: false,
        time: null
      }
    },

    startDicussionTimer() {
      this.discussionTimer = Math.trunc((new Date()).getTime() / 1000)
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
