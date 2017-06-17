import {Toast, AppFullscreen} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import Project from './project.vue'
import AddOrganizationModal from './modal/add-organization.vue'
import EditOrganizationModal from './modal/edit-organization.vue'
import AddProjectModal from './modal/add-project.vue'
import EditProjectModal from './modal/edit-project.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Project,
    AddOrganizationModal,
    EditOrganizationModal,
    AddProjectModal,
    EditProjectModal
  },

  data: () => ({
    organizations: [],
    projects: [],
    selectedProjectId: false
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    selectedProject() {
      return this.selectedProjectId
        ? this.projects.find(proj => proj.id === this.selectedProjectId)
        : false
    }
  },

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
    },

    handleProjectsLoaded(response) {
      this.projects = response.data

      const lastProjectId = +localStorage.getItem('lastProjectId')

      /*
       * If there where a project selected last time
       * And this project is in the list
       * Select it.
       */
      if (lastProjectId && response.data.some(proj => proj.id === lastProjectId)) {
        this.selectedProjectId = lastProjectId
      }
    },

    handleProjectsLoadError(error) {
      Toast.create.negative('Failed to load projects')
    },

    /* Select Project */
    selectProject(id) {
      this.selectedProjectId = id

      // Persist last selected project
      localStorage.setItem('lastProjectId', id)
    }
  }
}
