<template>
  <div class="is-fullheight">
    <div class="columns is-fullheight">
      <div class="column board-sidebar">
        <div v-if="!votation" class="timer title is-2">
          {{padZero(timePassed.minutes)}}:{{padZero(timePassed.seconds)}}
        </div>
        <div v-if="votation">
          <div class="timer title is-2">
            {{padZero(timePassed.minutes)}}:{{padZero(timePassed.seconds)}}
          </div>
          <div class="timer votetitle is-2">
            {{padZero(votationTimePassed.minutes)}}:{{padZero(votationTimePassed.seconds)}}
          </div>
        </div>
        <div class="tabs is-centered">
          <ul>
            <li :class="{'is-active': sidebarTab === 1}" @click="() => setSidebarTab(1)"><a>Users</a></li>
            <li :class="{'is-active': sidebarTab === 2}" @click="() => setSidebarTab(2)"><a>Stories</a></li>
            <li :class="{'is-active': sidebarTab === 3}" @click="() => setSidebarTab(3)"><a>Time</a></li>
          </ul>
        </div>

        <div v-if="sidebarTab === 1" class="connected-users">
          <article v-for="user in users" class="media">
            <figure class="media-left">
              <p class="image is-48x48">
                <gravatar :email="user.email" :size="48"></gravatar>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{user.display_name}}</strong>
                  <small>@{{user.username}}</small>
                </p>
              </div>
            </div>
          </article>
        </div>

        <div v-if="sidebarTab === 2" class="backlog">
          <article v-for="story in picked" class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{story.name}}</strong>
                  <br>
                  {{story.description}}
                </p>
                <small>
                  <a @click="undo"> remove </a>
                </small>
              </div>
            </div>
          </article>
          <hr/>
          <div v-if="isManager">
            <button
              v-if="!onGoing"
              @click="openStoriesModal"
              class="button is-primary is-fullwidth"
            >
              Choose a story
            </button>
            <button
              v-else
              class="button is-primary is-fullwidth is-disabled"
            >
              Choose a story
            </button>
          </div>

          <small>
            <a @click="openVotationModal"> init votation </a>
          </small>

          <br/>

          <small>
            <a @click="startDicussionTimer"> init discussion </a>
          </small>
        </div>

        <div v-if="sidebarTab === 4" class="votes">
          <article v-for="vote in votes" class="media">
            <figure class="media-left">
              <p class="image is-64x64">
                <img src="https://placeholdit.imgix.net/~text?txtsize=20&txt=Avatar&w=64&h=64&txttrack=0">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{vote.displayName}}</strong>
                  <small>@{{vote.username}}</small>
                  <small>{{vote.when}}</small>
                  <br>
                  Voted: <strong>{{vote.voted}}</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div class="column main-board">
        <p v-if="false" class="title is-spaced">
          #1 As a power user, I can specify files or folders to backup based
          on file size, date created and date modified
        </p>
        <p v-if="false" class="subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus
          ac lacus id vulputate. Integer sit amet magna feugiat, facilisis sem
          in, vehicula orci. Integer fringilla turpis congue ligula convallis,
          non auctor est scelerisque.
        </p>

        <hr v-if="false"/>

        <div class="chat-input">
          <div class="field">
            <p class="control">
              <input v-model="message" @keyup.enter="sendMessage" class="input is-medium" type="text" placeholder="Message">
            </p>
          </div>
        </div>

        <div class="chat">
          <div v-for="message in messages">
            <message
              :body="message.body"
              :user="player_db[message.user_id]"
              :fromSelf="message.user_id === loggedUser.id"
            >
            </message>
          </div>
        </div>

         <div v-if="modal.stories.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Choosing story</p>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <article v-for="(story, i) in options" class="media">
                  <label class="radio">
                  <input type="radio" @click="currentStory(story, i)">
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{story.name}}</strong>
                            <br>
                            <small>{{story.description}}</small>
                          </p>
                        </div>
                      </div>
                    </label>
                  </article>
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="chooseStory" class="button is-success">Choose</a>
                <a @click="modal.stories.open = false" class="button">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="modal.votation.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Inform votation time</p>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <form
                    method="post"
                    @submit.prevent="VotationTimer"
                    @keyup.13="VotationTimer"
                  >
                    <p class="control">
                      <input
                        class="input"
                        placeholder="Votation time (min)"
                        v-model="modal.votation.time"
                      >
                    </p>
                  </form>
                </div>
                <div v-if="modal.votation.erro" class="notification is-danger">
                  <button @click="modal.votation.erro = false" class="delete"></button>
                  Something went wrong
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="VotationTimer" class="button is-success">Start</a>
                <a @click="closeVotationModal">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="false" class="deck">
          <div v-for="card in deck" @click="() => select(card)" class="card" :class="cardClass(card)">
            <span v-if="card === 'Pass'">
              <i class="fa fa-forward"></i>
            </span>
            <span v-if="card === 'Coffee'">
              <i class="fa fa-coffee"/></i>
            </span>
            <span v-if="!['Pass', 'Coffee'].includes(card)">{{card}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
</script>

<style lang="sass" scoped>
$border-color: 1px solid rgba(0, 0, 0, .10)

.title
  text-align: center
  margin: 10px 0 0

.title1
  text-align: center
  margin: 0px 0 2px

.votetitle
  text-align: center
  margin: 0px 0 2px

.isvote
  text-align: right

.votes
  padding: 12px

.main-board
  overflow-y: auto
  padding: 10px 15px 20px 5px

  .title
    margin-bottom: 16px;

.chat-input
  margin: 10px 0 20px

  input
    border: 0
    background-color: #EAEFF3
    box-shadow: none
    color: #696969

.chat
  padding-bottom: 30px

.board-sidebar
  margin-top: 10px
  padding-top: 0
  flex: 0 0 25%
  min-width: 240px
  max-width: 420px
  border-right: $border-color
  overflow-y: auto

  .tabs
    margin-left: 8px

  .connected-users, .backlog
    padding: 0 15px

.card
  width: 70px
  height: 90px
  border-radius: 5px
  background-color: #3498db
  display: inline-block
  font-size: 36px
  font-weight: bolder
  color: #fff
  text-align: center
  padding-top: 22px
  cursor: pointer

  &.has-icon
    padding-top: 36px
    font-size: 24px

.deck
  position: fixed
  bottom: 0

  .card
    position: relative
    bottom: -20px
    transition: bottom .2s
    margin-right: 1.5px

    &:hover
      bottom: 0

    &.selected
      bottom: 10px
</style>
