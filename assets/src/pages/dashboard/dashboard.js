import {Toast, Loading, AppFullscreen, Dialog} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import ProjectPicker from 'components/project-picker.vue'
import Project from './project.vue'
import EditOrganizationModal from './modal/edit-organization.vue'
import EditProjectModal from './modal/edit-project.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Project,
    EditOrganizationModal,
    EditProjectModal,
    ProjectPicker
  },

  data: () => ({
    /* Socket */
    socket: false,
    notificationChannel: false,

    /* Sidebar */
    organizations: [],
    projects: [],
    selectedProjectId: false
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    ...mapState({
      token: state => state.auth.token
    }),

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
    },

    selectedOrganization() {
      if (!this.selectedProject) {
        return false
      }

      return this.organizations.find(org => org.id === this.selectedProject.organization_id)
    }
  },

  created() {
    const user = this.loggedUser

    if (!this.socket) {
      this.socket = new Socket('/socket', {params: {token: this.token}})
      this.socket.connect()
    }

    if (this.notificationChannel) {
      this.notificationChannel.leave()
    }

    this.channelConnect()

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
    /* Socket Connection */
    channelConnect() {
      Loading.show({
        message: 'Connecting to notification server',
        delay: 0
      })

      const user = this.loggedUser
      const channelName = `notifications:${user.id}`
      const channelParams = {}
      this.notificationChannel = this.socket.channel(channelName, channelParams)

      this.notificationChannel.on('joined_organization', this.channelJoinedOrganization)
      this.notificationChannel.on('joined_project', this.channelJoinedProject)
      this.notificationChannel.on('left_organization', this.channelLeftOrganization)
      this.notificationChannel.on('left_project', this.channelLeftProject)

      this.notificationChannel
        .join()
        .receive('ok', this.channelJoined)
        .receive('error', this.channelRejected)
    },

    channelJoined() {
      Loading.hide()
    },

    channelRejected(reason) {
      Loading.hide()

      if (reason === 'unauthorized')
        return Toast.create.negative('Unauthorized to join at notifications server')
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
    },

    /* Channel */
    channelJoinedOrganization({id}) {
      axios.get(`/organizations/${id}`)
        .then(this.handleOrganizationJoinedLoad)
        .catch(this.handleOrganizationJoinedFail)
    },

    handleOrganizationJoinedLoad(response) {
      const {data: organization} = response
      Toast.create.info(`Entered organization ${organization.display_name}`)
      /* Check if organization already is in list */
      const idx = this.organizations.findIndex(org => org.id === organization.id)

      if (idx !== -1) {
        /*
         * Here's a nasty hack to trigger Vue's reactiveness
         * since if you just assign, Vue will not now any change
         */
        Object.assign(this.organizations[idx], organization)
      } else {
        this.organizations.push(organization)
      }
    },

    handleOrganizationJoinedFail(error) {
      Toast.create.negative('Failed to load an organization you just joined. Please refresh the page.')
    },

    channelLeftOrganization({id}) {
      const idx = this.organizations.findIndex(org => org.id === id)

      if (idx !== -1) {
        const organization = this.organizations[idx]
        Toast.create.negative(`You where removed from the organization ${organization.display_name}`)
        this.organizations.splice(idx, 1)
      }
    },

    channelJoinedProject({id}) {
      axios.get(`/projects/${id}`)
        .then(this.handleProjectJoinedLoad)
        .catch(this.handleProjectJoinedFail)
    },

    handleProjectJoinedLoad(response) {
      const {data: project} = response
      Toast.create.info(`Entered project ${project.display_name}`)
      /* Check if project already is in list */
      const idx = this.projects.findIndex(proj => proj.id === project.id)

      if (idx !== -1) {
        /*
         * Here's a nasty hack to trigger Vue's reactiveness
         * since if you just assign, Vue will not now any change
         */
        Object.assign(this.projects[idx], project)
      } else {
        this.projects.push(project)
      }
    },

    channelLeftProject({id}) {
      const idx = this.projects.findIndex(proj => proj.id === id)

      if (idx !== -1) {
        const project = this.projects[idx]
        Toast.create.negative(`You where removed from the project ${project.display_name}`)
        this.projects.splice(idx, 1)
      }
    },

    handleProjectJoinedFail(error) {
      Toast.create.negative('Failed to load a project you just joined. Please refresh the page.')
    },

    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    }
  }
}
