import {Gravatar} from 'app/components'
import {mapGetters} from 'vuex'

export default {
  name: 'UserBlock',

  components: {Gravatar},

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedUser']),

    shouldRenderFooter() {
      if (!this.isAuthenticated) {
        return false
      } else {
        return this.loggedUser.id === this.user.id
      }
    }
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
