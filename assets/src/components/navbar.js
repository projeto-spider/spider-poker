import {mapGetters, mapActions} from 'vuex'
// TODO: fix app/components imports
// import {Gravatar, Dropdown} from 'app/components'
import Gravatar from './gravatar.vue'
import Dropdown from './dropdown.vue'
import LoggedUserDropdown from './logged-user-dropdown.vue'
import {DESKTOP_WIDTH} from 'app/utils'

export default {
  name: 'Navbar',

  components: {Gravatar, Dropdown, LoggedUserDropdown},

  computed: {
    ...mapGetters(['screenWidth', 'isAuthenticated', 'loggedUser']),

    isAtLeastDesktop() {
      return this.screenWidth < DESKTOP_WIDTH
    }
  },

  methods: {...mapActions(['toggleSidebar'])}
}
