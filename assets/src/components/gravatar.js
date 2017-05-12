import gravatar from 'gravatar'

export default {
  name: 'Gravatar',

  props: {
    email: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      default: 64
    },

    circle: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    url() {
      return gravatar.url(this.email, {size: this.size})
    },

    imageClass() {
      return {
        'is-round': this.circle
      }
    }
  }
}
