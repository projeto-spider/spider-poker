import {mapGetters} from 'vuex'
import Avatar from 'components/avatar.vue'

export default {
  name: 'Message',

  components: {Avatar},

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
