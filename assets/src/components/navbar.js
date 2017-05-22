import {mapGetters, mapActions} from 'vuex'
// TODO: fix app/components imports
// import {Gravatar, Dropdown} from 'app/components'
import Gravatar from './gravatar.vue'
import Dropdown from './dropdown.vue'
import LoggedUserDropdown from './logged-user-dropdown.vue'

export default {
  name: 'Navbar',

  components: {Gravatar, Dropdown, LoggedUserDropdown},

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedUser'])
  },

  methods: {...mapActions(['toggleSidebar'])}
}
