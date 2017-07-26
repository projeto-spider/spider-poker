export default {
  name: 'VotationDrawer',

  props: {
    selectedStory: Object,
    voting: Boolean,
    discussion: Boolean,
    selectedCard: {
      type: [Boolean, Number],
      default: false
    },
    order: Array,
    current_story: {
      type: [Boolean, Number],
      default: false
    },
    role: String,
    selectCard: Function,
    substories: Array,
    createSubstories: Function
  },

  computed: {
    cardsAvaible() {
      return [1, '1/2', 2, 3, 5, 8, 13, 20, 40, 100, '?', 'time'].filter(card => this.voting ? true : !isNaN(card))
    }
  }
}
