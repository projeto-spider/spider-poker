import {Toast, Loading, Dialog} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import ProjectStory from 'components/story/project-story.vue'

export default {
  name: 'Project',

  components: {ProjectStory},

  props: {
    socket: [Object, Boolean],
    organization: [Object, Boolean],
    project: [Object, Boolean]
  },

  data: () => ({
    /* Socket */
    channel: false,

    /* Backlog */
    order: [],
    stories: {},

    /* Adding Story */
    title: '',
    description: ''
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    backlog() {
      return this.order
        .map(id => Object.assign({
          children: this.stories[id].backlog.map(child => this.stories[child])
        }, this.stories[id]))
    }
  },

  watch: {
    project() {
      this.projectChanged()
    }
  },

  /*
  *  With hot reloading we keep the state and Vue watcher
  *  doesn't trigger reload stories so I'm using this workaround
  */
  created() {
    if (this.project) {
      this.projectChanged()
    }
  },

  methods: {
    projectChanged() {
      this.order = []
      this.stories = {}

      if (this.channel) {
        this.channel.leave()
      }

      this.channelConnect()
    },

    /* Socket Connection */
    channelConnect() {
      Loading.show({
        message: 'Connecting to backlog server',
        delay: 0
      })

      const projectId = this.project.id
      const channelName = `backlog:${projectId}`
      const channelParams = {}
      this.channel = this.socket.channel(channelName, channelParams)

      this.channel.on('unshift_story', this.channelUnshiftStory)
      this.channel.on('story_updated', this.channelStoryUpdated)
      this.channel.on('story_deleted', this.channelStoryDeleted)
      this.channel.on('order_change', this.channelOrderChange)

      this.channel
        .join()
        .receive('ok', this.channelJoined)
        .receive('error', this.channelRejected)
    },

    channelJoined() {
      Loading.hide()
      this.loadBacklog()
    },

    channelRejected(reason) {
      Loading.hide()

      if (reason === 'unauthorized')
        return Toast.create.negative('Unauthorized to join at backlog server')

      if (reason === 'not found')
        return Toast.create.negative('Backlog server not found')
    },

    /* Backlog Loading */
    loadBacklog() {
      Loading.show({
        message: 'Loading backlog',
        delay: 0
      })

      axios.get(`/projects/${this.project.id}/backlog`)
        .then(this.handleLoadedBacklog)
        .catch(this.handleLoadBacklogFail)
    },

    handleLoadedBacklog(response) {
      Loading.hide()
      this.stories = response.data

      const order = response.meta.order.reverse()
      // shamelessly push stories with intervals of 50ms
      // just to have a neat enter animation :D
      const interval = setInterval(() =>
        order.length
          ? this.order.push(order.pop())
          : clearInterval(interval)
      , 50)
    },

    handleLoadBacklogFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to load backlog')
    },

    /* Unshift Story */
    unshiftStory() {
      if (this.title === '') {
        return
      }

      const {title, description} = this
      this.title = ''
      this.description = ''

      this.channel.push('unshift_story', {title, description})
    },

    channelUnshiftStory({story, order}) {
      /*
       * A new object is assigned since Vue needs to make
       * our new story observable otherwise editions won't work!
      */
      this.stories = {
        ...this.stories,
        [story.id]: story
      }
      this.order = order
    },

    /* Story Update */
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
            handler: data => this.updateStory(story, data)
          }
        ]
      })
    },

    updateStory(story, {title, description}) {
      this.channel.push('update_story', {story_id: story.id, title, description})
    },

    channelStoryUpdated({story}) {
      this.stories[story.id] = story
    },

    /* Story Deletion */
    confirmStoryDeletion(story) {
      Dialog.create({
        title: 'Danger',
        message: "You can't undo a deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: () => this.deleteStory(story)
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteStory({id: story_id}) {
      this.channel.push('delete_story', {story_id})
    },

    channelStoryDeleted({order, story}) {
      this.order = order
      this.stories[story.id] = null
    },

    /* Story Reordering */
    promptNewPosition(story, position, parent = false) {
      Dialog.create({
        title: 'Changing Story Position',

        form: {
          position: {
            type: 'numeric',
            label: 'Next Position',
            model: position + 1, // Do not show 0 index
            min: 1,
            max: parent ? parent.backlog.length : this.order.length
          }
        },

        buttons: [
          'Cancel',
          {
            label: 'Move',
            handler: ({position}) => this.changeStoryPosition(story, position, parent)
          }
        ]
      })
    },

    changeStoryPosition(story, position, parent) {
      // Down by one since the user pick a position starting from 1, not 0
      this.channel.push('move_story', {story_id: story.id, position: position - 1, parent_id: parent && parent.id})
    },

    channelOrderChange({order}) {
      this.order = order
    }
  }
}
