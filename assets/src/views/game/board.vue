<template>
  <div class="is-fullheight">
    <div class="columns is-fullheight">
      <div class="column board-sidebar">
        <div class="timer title is-2">
          {{padZero(timePassed.minutes)}}:{{padZero(timePassed.seconds)}}
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
                <img :src="gravatar(user.email)">
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
          <article v-for="story in backlog" class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{story.name}}</strong>
                  <br>
                  <small>{{story.description}}</small>
                </p>
              </div>
            </div>
          </article>
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
          <article
            v-for="message in messages"
            class="media media-message"
            :class="{'is-from-self': message.user.id === loggedinId}"
          >
            <figure class="media-left">
              <p class="image is-48x48">
                <img :src="gravatar(message.user.email)">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{message.user.display_name}}</strong>
                  <small>@{{message.user.username}}</small>
                  <br>
                  {{message.body}}
                </p>
              </div>
            </div>
          </article>
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
import {mapState} from 'vuex'
import gravatar from 'gravatar'

export default {
  name: 'BoardView',

  data: () => {
    const time = Math.trunc((new Date()).getTime() / 1000)

    return {
      start: time,
      now: time,
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
        {name: 'Fourth', description: 'Lorem Ipsum'},
      ],
      users: [],
      message: '',
      messages: []

    }
  },

  computed: {
    ...mapState({
      loggedinId: R.view(R.lensPath(['auth', 'user', 'id'])),
      token: R.view(R.lensPath(['auth', 'token']))
    }),

    timePassed() {
      return {
        seconds: (this.now - this.start) % 60,
        minutes: Math.trunc((this.now - this.start) / 60) % 60
      }
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

    gravatar(email) {
      return gravatar.url(email, {size: 512})
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

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }
}
</script>

<style lang="sass" scoped>
$border-color: 1px solid rgba(0, 0, 0, .10)

.title
  text-align: center
  margin: 10px 0 0

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

.media-message
  margin-top: 0

  &.media + .media
    border-top: 0

  .media-left img
    border-radius: 50%

  .media-content
    background-color: #00B1FF
    padding: 3px 10px
    border-radius: 5px

    .content, strong
      color: #fff

  &.is-from-self
    flex-direction: row-reverse

    .media-left
      margin-right: 0

    .media-content
      margin-right: 10px
      background-color: #EAEFF3

      .content, strong
        color: #000
</style>
