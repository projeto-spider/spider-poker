import {Toast, AppFullscreen} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import AddOrganizationModal from './modal/add-organization.vue'
import EditOrganizationModal from './modal/edit-organization.vue'
import AddProjectModal from './modal/add-project.vue'
import EditProjectModal from './modal/edit-project.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar, AddOrganizationModal, EditOrganizationModal, AddProjectModal, EditProjectModal
  },

  data: () => ({
    organizations: [],
    projects: [],
  }),

  computed: mapGetters(['loggedUser']),

  created() {
    const user = this.loggedUser

    axios.get(`users/${user.id}/organizations`)
      .then(this.handleOrganizationsLoaded)
      .then(() =>
        axios.get(`users/${user.id}/projects`)
          .then(this.handleProjectsLoaded)
          .catch(this.handleProjectsLoadError)
      )
      .catch(this.handleOrganizationsLoadError)
  },


  methods: {
    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    },

    /* Startup Load Handlers */
    handleOrganizationsLoaded(response) {
      this.organizations = response.data
    },

    handleOrganizationsLoadError(error) {
      Toast.create.negative('Failed to load organizations')
      console.error(error)
    },

    handleProjectsLoaded(response) {
      this.projects = response.data
    },

    handleProjectsLoadError(error) {
      Toast.create.negative('Failed to load projects')
      console.error(error)
    }
  }
}
