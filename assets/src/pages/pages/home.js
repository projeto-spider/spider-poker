import {mapGetters, mapActions} from 'vuex'
import {UserBlock, MembershipsBlock, Gravatar} from 'app/components'
// import {Users} from 'app/api'

export default {
  name: 'HomePage',

  components: {UserBlock, MembershipsBlock, Gravatar},

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
