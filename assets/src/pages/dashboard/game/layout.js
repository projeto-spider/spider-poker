import Story from 'components/story/story.vue'

export default {
  name: 'GameLayout',

  components: {Story},

  props: {
    story: [Boolean, Object],
    game: [Boolean, Object]
  }
}