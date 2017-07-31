import {Dialog} from 'quasar'
import BacklogChannel from './channel.js'
import ProjectStory from 'components/story/project-story.vue'

export default {
  name: 'Stories',

  extends: BacklogChannel,

  components: {ProjectStory},

  data: () => ({
    /* Adding Story */
    title: '',
    description: ''
  }),

  methods: {
    unshiftStory() {
      if (this.title === '') {
        return
      }

      const {title, description} = this
      this.title = ''
      this.description = ''

      this.channel.push('story:unshift', {title, description})
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

    confirmStoryDeletion(story) {
      Dialog.create({
        title: 'Danger',
        message: "You can't undo a deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: () =>
              this.channel.push('story:delete', {story_id: story.id})
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
    }
  }
}
