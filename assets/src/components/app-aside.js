import {mapGetters, mapActions} from 'vuex'
import {mixin as clickaway} from 'vue-clickaway'
import {Gravatar, Dropdown, LoggedUserDropdown} from 'app/components'
import {DESKTOP_WIDTH} from 'app/utils'

export default {
  name: 'Sidebar',

  mixins: [clickaway],

  components: {Gravatar, Dropdown, LoggedUserDropdown},

  computed: {
    ...mapGetters(['screenWidth', 'sidebarOpen', 'isAuthenticated', 'loggedUser']),

    asideClass() {
      return {'is-open': this.open}
    },

    isAtLeastDesktop() {
      return this.screenWidth >= DESKTOP_WIDTH
    },

    open() {
      return this.isAtLeastDesktop ? true : this.sidebarOpen
    },

    transition() {
      return this.isAtLeastDesktop ? 'none' : 'fadeLeft'
    }
  },

  methods: {
    ...mapActions(['toggleSidebar']),

    toggle() {
      if (!this.isAtLeastDesktop) {
        this.toggleSidebar()
      }
    }
  }
}
