export default {
  name: 'ProjectStory',

  props: {
    story: Object,
    isChild: Boolean,
    promptNewPosition: Function,
    promptStoryUpdate: Function,
    confirmStoryDeletion: Function
  }
}
