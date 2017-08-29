import Story from 'components/story/story.vue'
import ProjectStory from 'components/story/project-story.vue'
import Message from './chat/message.vue'
import MessageInput from './chat/message-input.vue'

export default {
  name: 'GameLayout',

  components: {
    Story,
    ProjectStory,
    Message,
    MessageInput
  },

  props: {
    channel: [Boolean, Object],
    story: [Boolean, Object],
    game: [Boolean, Object],
    chat: Array,
    sendMessage: Function,
    promptNewPosition: Function,
    promptStoryUpdate: Function,
    confirmStoryDeletion: Function
  }
}