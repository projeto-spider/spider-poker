import Story from "./story.vue"

export default {
  name: 'GameStory',

  components: {Story},

  props: {
    story: Object,
    isChild: Boolean,
    selectStory: Function,
    role: String,
    voting: Boolean,
    discussion: Boolean,
    currentStory:{
      type: [Number, Boolean],
      default: false
    }
  }
}
