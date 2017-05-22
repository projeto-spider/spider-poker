import {mapGetters, mapActions} from 'vuex'
import {Gravatar, Dropdown, LoggedUserDropdown} from 'app/components'
import Sidebar from './sidebar.vue'

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
