import {Toast, AppFullscreen, Dialog} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import Project from './project.vue'
import EditOrganizationModal from './modal/edit-organization.vue'
import EditProjectModal from './modal/edit-project.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Project,
    EditOrganizationModal,
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
      if (!this.selectedProjectId) {
        return false
      }

      const project = this.projects
        .find(proj => proj.id === this.selectedProjectId)

      /*
       * If you delete a project while you're at it
       * bad things would happen, so let me prevent it.
      */
      if (!project) {
        this.selectedProjectId = false
        return false
      }

      return project
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
          'Cancel',
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
    },

    askProjectName() {
      Dialog.create({
        title: 'Creating Project',
        form: {
          name: {
            type: 'textbox',
            label: 'Name',
            model: ''
          },

          organizationId: {
            type: 'radio',
            model: 0,
            label: 'Organization',
            items: this.organizations
              .map(({id: value, display_name: label}) => ({value, label}))
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Create',
            classes: 'positive',
            handler: this.createProject
          }
        ]
      })
    },

    createProject({organizationId, name}) {
      axios.post(`/organizations/${organizationId}/projects`, {data: {name}})
        .then(this.handleProjectCreated)
        .catch(this.handleProjectCreationFail)
    },

    handleProjectCreated(response) {
      Toast.create.positive('Created project successfully')
      this.projects.push(response.data)
    },

    handleProjectCreationFail(error) {
      const {errors} = error.response.data

      if (error.response.status === 400) {
        return Toast.create.negative('Select an organization')
      }

      if (error.response.status !== 422) {
        return Toast.create.negative('Something went wrong')
      }

      if (errors.organization) {
        Toast.create.negative(
          errors.organization
            .map(msg => `Organization ${msg}`)
            .join('\n'))
      }

      if (errors.name) {
        Toast.create.negative(
          errors.name
            .map(msg => `Name ${msg}`)
            .join('\n'))
      }
    }
  }
}
