import Gravatar from 'components/gravatar.vue'

export default {
  name: 'UserPresence',

  components: {Gravatar},

  props: {
    online: Array,
    offline: Array,
    state: Number,
    votes: {
      type: [Object, Array],
      default: Object
    },
    voting: Boolean,
    discussion: Boolean
  }
}
