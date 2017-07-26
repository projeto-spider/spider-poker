import Story from './story.vue'

export default {
  name: 'ProjectStory',

  components: {Story},

  props: {
    story: Object,
    isChild: Boolean,
    promptNewPosition: Function,
    promptStoryUpdate: Function,
    confirmStoryDeletion: Function
  }
}
