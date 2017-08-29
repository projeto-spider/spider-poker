<template>
  <img :src="url" :class="imageClass"/>
</template>

<script>
import gravatar from 'gravatar'

export default {
  name: 'Gravatar',

  props: {
    user: {
      type: Object,
      required: true
    },
    // email: {
    //   type: String,
    //   required: true
    // },

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
      if (this.user.avatar) {
        return this.user.avatar
      }

      return gravatar.url(this.user.email, {size: this.size})
    },

    imageClass() {
      return {
        'is-round': this.circle
      }
    }
  }
}
</script>

<style lang="sass" scoped=true>
.is-round
  border-radius: 50%
</style>
