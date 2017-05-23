import {mapGetters, mapActions} from 'vuex'
import {UserBlock, Gravatar} from 'app/components'
// import {Users} from 'app/api'

export default {
  name: 'HomePage',

  components: {UserBlock, Gravatar},

  data() {
    return {
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedUser']),
  },

  methods: {
    ...mapActions(['hideFooter', 'showFooter', 'enableFullheightPage', 'disableFullheightPage'])
  },

  async created() {
    this.hideFooter()
    this.enableFullheightPage()
  },

  destroy() {
    this.showFooter()
    this.disableFullheightPage()
  }
}
