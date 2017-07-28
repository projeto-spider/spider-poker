import {Toast, Loading, AppFullscreen, Dialog} from 'quasar'
import {Socket} from 'phoenix'
import {mapState, mapGetters, mapActions} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'
import MainDrawerProject from './main-drawer/project.vue'
import Backlog from './backlog.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Backlog,
    MainDrawerProject
  },

  data: () => ({
    /* Socket */
    socket: false,
    notificationChannel: false,
  }),

  computed: {
    ...mapGetters(['loggedUser', 'projects', 'selectedProject']),

    ...mapState({
      token: state => state.auth.token
    })
  },

  created() {
    if (!this.socket) {
      this.socket = new Socket('/socket', {params: {token: this.token}})
      this.socket.connect()
    }

    if (this.notificationChannel) {
      this.notificationChannel.leave()
    }

    this.channelConnect()

    this.syncProjects()
      .catch(() => Toast.create.negative('Failed to load projects'))
  },

  methods: {
    ...mapActions(['syncProjects', 'createProject']),

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

      this.notificationChannel.on('joined_project', this.channelJoinedProject)
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

    promptCreateProject() {
      Dialog.create({
        title: 'Creating Project',

        form: {
          name: {
            type: 'textbox',
            label: 'Name',
            model: ''
          },

          organization: {
            type: 'textbox',
            label: 'Organization name (optional)',
            model: ''
          },
        },

        buttons: [
          'Cancel',
          {
            label: 'Create',
            classes: 'positive',
            handler: data =>
              this.createProject(data)
                .then(() => Toast.create.positive('Created project successfully'))
                .catch(() => Toast.create.negative('Failed to create project'))
          }
        ]
      })
    },

    /* Channel */
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
