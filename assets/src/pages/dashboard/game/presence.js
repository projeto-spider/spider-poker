import Avatar from 'components/avatar.vue'
import {STATE} from 'utils/enums'

export default {
  name: 'Presence',

  components: {Avatar},

  props: {
    online: Array,
    offline: Array,
    state: Number,
    votes: {
      type: [Object, Array],
      default: Object
    }
  },

  computed: {
    voting() {
      return this.state == STATE.VOTING
    },

    discussion() {
      return this.state == STATE.DISCUSSION
    }
  }
}
