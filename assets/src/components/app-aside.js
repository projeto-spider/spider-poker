import {mapGetters, mapActions} from 'vuex'
import {mixin as clickaway} from 'vue-clickaway'
import {Gravatar, Dropdown, LoggedUserDropdown} from 'app/components'
import Sidebar from './sidebar.vue'
import {DESKTOP_WIDTH} from 'app/utils'
console.log(Sidebar)

export default {
  name: 'AppSidebar',

  mixins: [clickaway],

  components: {Sidebar, Gravatar, Dropdown, LoggedUserDropdown},

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
