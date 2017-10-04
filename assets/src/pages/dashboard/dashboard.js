import {Toast, Loading, AppFullscreen, Dialog} from 'quasar'
import {mapGetters, mapActions} from 'vuex'
import Avatar from 'components/avatar.vue'
import ProjectItem from './main-drawer/project-item.vue'
import Stories from './backlog/stories.vue'
import BacklogChannel from './backlog/channel.js'
import GameLayout from './game/layout.vue'
import Timer from './game/timer.vue'
import Presence from './game/presence.vue'
import ImportModal from './import-modal/modal.vue'
import GamesModal from './games-modal/modal.vue'
import {STATE} from 'utils/enums'

export default {
  name: 'Dashboard',

  extends: BacklogChannel,

  components: {
    Avatar,
    Stories,
    ProjectItem,
    GameLayout,
    Timer,
    Presence,
    ImportModal,
    GamesModal
  },

  data: () => ({
    selectedOrg: '',
    projectName: '',
    gameStart: null
  }),

  computed: {
    ...mapGetters([
      'loggedUser',
      'projects',
      'selectedProject',
      'socketConnected',
      'socket',
      'notificationsChannel',
      'inGame'
    ]),

    isManager() {
      if (!this.project) {
        return false
      }

      return this.project.manager_id === this.loggedUser.id
    },

    currentGameStateLabel() {
      if (!this.game) {
        return false
      }

      switch(this.game.state) {
        case STATE.CREATED:
          return 'Game started'
        case STATE.IDLE:
          return 'Game idle'
        case STATE.VOTING:
          return 'Game in vote'
        case STATE.DISCUSSION:
          return 'Game in discussion'
      }
    }
  },

  async created() {
    if (!this.socketConnected) {
      await this.connectSocket()
    }

    Loading.show({
      message: 'Connecting to notifications server'
    })

    this.connectNotificationsChannel()
      .then(Loading.hide)
      .catch(({reason}) => {
        Loading.hide()

        if (reason === 'unauthorized') {
          Toast.create.negative('Unauthorized to join at notifications server')
          return this.$router.push({name: 'Logout'})
        }

        return Toast.create.negative('Failed to join at notifications server')
      })

    this.syncProjects()
      .catch(() => Toast.create.negative('Failed to load projects'))

    this.$ga.page(this.$router)
  },

  methods: {
    ...mapActions([
      'syncProjects',
      'createProject',
      'connectSocket',
      'connectNotificationsChannel'
    ]),

    promptStoryUpdate(story) {
      Dialog.create({
        title: 'Updating Story',

        form: {
          title: {
            type: 'textbox',
            label: 'Title',
            model: story.title
          },

          description: {
            type: 'textarea',
            label: 'Description',
            model: story.description
          }
        },

        buttons: [
          'Cancel',
          {
            label: 'Update',
            handler: ({title, description}) =>
              this.channel.push('story:update', {story_id: story.id, title, description})
          }
        ]
      })
    },

    promptNewPosition(story, position, parent = false) {
      Dialog.create({
        title: 'Changing Story Position',

        form: {
          position: {
            type: 'numeric',
            label: 'Next Position',
            model: position + 1, // Do not show 0 index
            min: 1,
            max: parent ? parent.children.length : this.backlog.length
          }
        },

        buttons: [
          'Cancel',
          {
            label: 'Move',
            // Position is downed by one since
            // the user pick a position starting from 1, not 0
            handler: ({position}) =>
              parent
               ? this.channel.push('substory:move', {
                 story_id: story.id,
                 position: position - 1,
                 parent_id: parent.id
               })
               : this.channel.push('story:move', {
                 story_id: story.id,
                 position: position - 1
               })
          }
        ]
      })
    },

    promptStoryUpdate(story) {
      Dialog.create({
        title: 'Updating Story',

        form: {
          title: {
            type: 'textbox',
            label: 'Title',
            model: story.title
          },

          description: {
            type: 'textarea',
            label: 'Description',
            model: story.description
          }
        },

        buttons: [
          'Cancel',
          {
            label: 'Update',
            handler: ({title, description}) =>
              this.channel.push('story:update', {story_id: story.id, title, description})
          }
        ]
      })
    },

    confirmStoryDeletion(story, parent = false) {
      Dialog.create({
        title: 'Danger',
        message: "You can't undo a deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: () => {
              if (parent) {
                return this.channel.push('substory:delete', {parent_id: parent.id, story_id: story.id})
              }

              this.channel.push('story:delete', {story_id: story.id})
            }
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    promptNewPosition(story, position, parent = false) {
      Dialog.create({
        title: 'Changing Story Position',

        form: {
          position: {
            type: 'numeric',
            label: 'Next Position',
            model: position + 1, // Do not show 0 index
            min: 1,
            max: parent ? parent.children.length : this.backlog.length
          }
        },

        buttons: [
          'Cancel',
          {
            label: 'Move',
            // Position is downed by one since
            // the user pick a position starting from 1, not 0
            handler: ({position}) =>
              parent
               ? this.channel.push('substory:move', {
                 story_id: story.id,
                 position: position - 1,
                 parent_id: parent.id
               })
               : this.channel.push('story:move', {
                 story_id: story.id,
                 position: position - 1
               })
          }
        ]
      })
    },

    importStories(stories) {
      stories.reverse()
        .forEach(({title, description, source = 0}) => {
          this.channel.push('story:unshift', {title, description, source})
        })
    },

    searchOrganization(query, done) {
      const organizations =
        this.projects
          .map(project => project.organization)
          .filter(organization => organization && organization.indexOf(query) !== -1)
          .filter((org, i, organizations) =>
            !organizations.slice(i + 1).includes(org))
          .map(organization => ({
            value: organization,
            label: organization
          }))

      done(organizations)
    },

    startProject(name, organization) {
      this.createProject({name, organization})
        .then(() => {
          Toast.create.positive('Created project successfully')
          this.$ga.event('Project', 'Create', 'Created projects')
        })
        .catch(() => Toast.create.negative('Failed to create project'))
    },

    sendMessage(body) {
      this.channel.push('game:message', {body})
    },

    startGame(story) {
      this.channel.push('game:create', {story_id: story.id})
      this.$ga.event('Game', 'Play', 'Played games')
      this.gameStart = Math.trunc((new Date().getTime()) / 1000) * 1000
    },

    stopGame() {
      if (!this.inGame) {
        return
      }

      this.channel.push('game:stop')
      const gameFinish = Math.trunc((new Date()).getTime() / 1000) * 1000
      const gameTime = gameFinish - this.gameStart
      this.$ga.time('Game', 'Game timer', gameTime, 'Game time')
    },

    startVoting() {
      this.channel.push('game:voting:start')
      if (!this.created) {
        //These operations are for Google Analytics.
        var end = Math.trunc(new Date(this.game.voting_end).getTime() / 1000) * 1000
        var now = Math.trunc((new Date()).getTime() / 1000) * 1000
        const discussionTime = now - end
        this.$ga.time('Discussion', 'Dicussion timer', discussionTime, 'Discussion time')
      }
    },

    stopVoting() {
      this.channel.push('game:voting:stop')

      //These operations are for Google Analytics.
      var start = Math.trunc(new Date(this.game.voting_start).getTime() / 1000) * 1000
      var end = Math.trunc((new Date()).getTime() / 1000) * 1000
      const votationTime = end - start
      this.$ga.time('Votation', 'Votation timer', votationTime, 'Votation time')
    },

    vote() {
      const labelFor = estimation => {
        if (estimation === 'time') {
          return 'Ask for a break'
        }

        if (estimation === '?') {
          return "I'm not sure"
        }

        return estimation
      }

      Dialog.create({
        title: 'Voting',

        form: {
          estimation: {
            label: 'Estimation',
            type: 'radio',
            items: ['?', 'time', 1, '1/2', 2, 3, 5, 8, 13, 20, 40, 100]
              .map(estimation => ({
                label: labelFor(estimation),
                value: estimation
              }))
          }
        },

        buttons: [
          {
            label: 'Submit',
            handler: ({estimation}) => {
              this.channel.push('game:voting:vote', {estimation})
            }
          }
        ]
      })
    },

    score() {
      Dialog.create({
        title: 'Final estimation',

        form: {
          estimation: {
            label: 'Estimation',
            type: 'radio',
            items: [1, 2, 3, 5, 8, 13, 20, 40, 100]
              .map(estimation => ({
                label: estimation,
                value: estimation
              }))
          }
        },

        buttons: [
          {
            label: 'Submit',
            handler: ({estimation}) => {
              this.channel.push('game:discussion:score', {estimation})
              this.$ga.event('Story', 'Estimate', 'Estimated stories')
            }
          }
        ]
      })
    },

    createSubstory() {
      Dialog.create({
        title: 'Creating substory',

        form: {
          title: {
            type: 'textbox',
            label: 'Title',
            model: ''
          },

          description: {
            type: 'textbox',
            label: 'Description (optional)',
            model: ''
          }
        },

        buttons: [
          {
            label: 'Create',
            handler: attrs => {
              if (!attrs.title) {
                return Toast.create.warning('Title required to create story')
              }

              this.channel.push('game:discussion:create_substory', attrs)
            }
          }
        ]
      })
    },

    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    },

    modalCloser() {
      this.selectedOrg = ''
      this.projectName = ''
    }
  }
}
