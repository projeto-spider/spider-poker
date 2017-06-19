import {Toast, AppFullscreen, Dialog} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import Project from './project.vue'
import EditOrganizationModal from './modal/edit-organization.vue'
import AddProjectModal from './modal/add-project.vue'
import EditProjectModal from './modal/edit-project.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Project,
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
    },

    askOrganizationName() {
      Dialog.create({
        title: 'Creating Organization',
        form: {
          name: {
            type: 'textbox',
            label: 'Name',
            model: ''
          }
        },
        buttons: [
          {
            label: 'Cancel'
          },
          {
            label: 'Create',
            classes: 'positive',
            handler: this.createOrganization
          }
        ]
      })
    },

    createOrganization({name}) {
      axios.post('/organizations', {data: {name}})
        .then(this.handleOrganizationCreated)
        .catch(this.handleOrganizationCreationFail)
    },

    handleOrganizationCreated(response) {
      Toast.create.positive('Created organization successfully')
      this.organizations.push(response.data)
    },

    handleOrganizationCreationFail(error) {
      Toast.create.negative(
        error.response.data.errors.name
          .map(msg => 'Name ' + msg)
          .join('\n'))
    }
  }
}
