import {mapGetters, mapActions} from 'vuex'
import {mixin as clickaway} from 'vue-clickaway'
import {Gravatar, Dropdown, LoggedUserDropdown} from 'app/components'
import Sidebar from './sidebar.vue'

export default {
  name: 'AppSidebar',

  mixins: [clickaway],

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
