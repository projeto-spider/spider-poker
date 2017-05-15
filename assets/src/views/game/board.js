import R from 'ramda'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import {Gravatar} from 'app/components'
import Message from './message'

const emptyStoriesModal = {
  open: false,
  currentPosition: null,
  story: null
}

const emptyVotationModal = {
  open: false,
  time: null,
  erro: false
}

export default {
  name: 'BoardView',

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
      backlog: [
        {name: 'First', description: 'Lorem Ipsum'},
        {name: 'Second', description: 'Lorem Ipsum'},
        {name: 'Third', description: 'Lorem Ipsum'},
        {name: 'Fourth', description: 'Lorem Ipsum'}
      ],
      players_ids: [],
      player_db: {},
      message: '',
      messages: [],
      picked: [],
      options: [],
      onGoing: false,
      isManager: true,
      modal: {
        stories: emptyStoriesModal,
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
      return R.map(R.flip(R.prop)(this.player_db), this.players_ids)
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

    openStoriesModal() {
      this.modal.stories.open = true
      this.options = this.backlog
    },

    openVotationModal() {
      this.modal.votation.open = true
    },

    currentStory(story, index) {
      this.modal.stories = {
        ...emptyStoriesModal,
        currentPosition: index,
        story
      }
    },

    chooseStory() {
      this.picked.push(this.modal.stories.story)
      this.modal.stories.open = false
      this.onGoing = true
    },

    undo() {
      this.picked.shift()
      this.modal.stories.open = true
      this.onGoing = false
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

    apply_leaves(leaves) {
      R.mapObjIndexed((_, id) => {
        this.players_ids = this.players_ids.filter(R.compose(R.not, R.equals(id)))
      }, leaves)
    },

    apply_joins(joins) {
      R.mapObjIndexed(({user}, id) => {
        this.players_ids.push(id)
        this.player_db[id] = user
      }, joins)
    }
  },

  created() {
    window.setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000);
    },1000)

    this.socket = new Socket('/socket', {params: {token: this.token}})
    this.socket.connect()

    this.channel = this.socket.channel("game:lobby", {})

    this.channel.on("message", payload => {
      this.messages.unshift(payload.message)
    })

    this.channel.on('user_joined', payload => {
      this.users.push(payload.user)
    })

    this.channel.on('presence_state', users => {
      this.apply_joins(users)
    })

    this.channel.on('presence_diff', ({leaves, joins}) => {
      this.apply_leaves(leaves)
      this.apply_joins(joins)
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  },

  beforeDestroy() {
    this.channel.leave()
  }
}
