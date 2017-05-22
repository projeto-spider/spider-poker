import {mapGetters, mapActions} from 'vuex'
import {Sidebar, Gravatar, Dropdown, LoggedUserDropdown} from 'app/components'

export default {
  name: 'AppSidebar',

  components: {Sidebar, Gravatar, Dropdown, LoggedUserDropdown},

  computed: {
    ...mapGetters(['sidebarOpen', 'isAuthenticated', 'loggedUser']),

    asideClass() {
      return {'is-open': this.open}
    }
  },

  methods: {
    ...mapActions(['toggleSidebar'])
  }
}
