import {mapGetters} from 'vuex'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'Message',

  components: {Gravatar},

  props: {
    message: Object
  },

  computed: {
    ...mapGetters(['loggedUser']),

    anonymous() {
      return this.message.user_id === 0
    },

    user() {
      return this.message.user
    }
  }
}
