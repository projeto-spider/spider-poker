export default {
  name: 'GameStory',

  props: {
    story: Object,
    isChild: Boolean,
    selectStory: Function,
    role: String,
    voting: Boolean,
    discussion: Boolean,
    currentStory: Number
  }
}
