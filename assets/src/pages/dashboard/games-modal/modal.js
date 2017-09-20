import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Message from '../game/chat/message.vue'

export default {
  name: 'GamesModal',

  components: {Message},

  props: {
    modal: [Boolean, Object]
  },
  
  data: () => ({
    loading: false,

    games: [],
    gamePage: 0,
    gameTotalPages: 1,

    selectedGame: false,
    messages: [],
    messagesPage: 0,
    messageTotalPages: 1
  }),

  computed: {
    ...mapGetters([
      'selectedProject'
    ]),

    hasMoreGames() {
      return this.gamePage < this.gameTotalPages
    },

    hasMoreMessages() {
      return this.messagesPage < this.messageTotalPages
    }
  },

  created() {
    this.moreGames()
  },

  methods: {
    moreGames() {
      this.loading = true

      axios.get(`/projects/${this.selectedProject.id}/games?page=${this.gamePage + 1}`)
        .then(({headers, data: games}) => {
          this.gamePage = +headers['page-number']
          this.gameTotalPages = +headers['total-pages']
          this.games = this.games.concat(games)
          this.loading = false
        })
    },

    moreMessages() {
      this.loading = true

      axios.get(`/projects/${this.selectedProject.id}/games/${this.selectedGame}/messages/?page=${this.messagesPage + 1}`)
        .then(({headers, data: messages}) => {
          this.messagesPage = +headers['page-number']
          this.messageTotalPages = +headers['total-pages']
          this.messages = this.messages.concat(messages)
          this.loading = false
        })
    },

    selectGame(id) {
      this.selectedGame = id
      this.messages = []
      this.messagesPage = 0
      this.messageTotalPages = 1
      this.$refs.messagesModal.open()
      this.moreMessages()
    },

    unselectGame() {
      this.selectedGame = false
      this.$refs.messagesModal.close()
    }
  }
}