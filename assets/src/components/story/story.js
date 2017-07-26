export default {
  name: 'Story',

  props: {
    story: Object,
    isChild: Boolean
  },

  computed: {
    estimation() {
      if(this.story.children && this.story.children.length) {
        return (this.story.children
                .map(child => child.estimation || 0)
                .reduce((x, y) => x + y, 0))
      } else {
        return this.story.estimation
      }
    }
  }
}
