import {Toast, Loading, AppFullscreen, Dialog} from 'quasar'
import {mapGetters, mapActions} from 'vuex'
import Gravatar from 'components/gravatar.vue'
import ProjectItem from './main-drawer/project-item.vue'
import Backlog from './backlog.vue'

export default {
  name: 'Dashboard',

  components: {
    Gravatar,
    Backlog,
    ProjectItem
  },

  data: () => ({
  }),

  computed: {
    ...mapGetters([
      'loggedUser',
      'projects',
      'selectedProject',
      'socketConnected',
      'socket',
      'notificationsChannel'
    ])
  },

  async created() {
    if (!this.socketConnected) {
      await this.connectSocket()
    }

    Loading.show({
      message: 'Connecting to notifications server'
    })

    this.connectNotificationsChannel()
      .then(Loading.hide)
      .catch(({reason}) => {
        Loading.hide()

        if (reason === 'unauthorized') {
          Toast.create.negative('Unauthorized to join at notifications server')
          return this.$router.push({name: 'Logout'})
        }

        return Toast.create.negative('Failed to join at notifications server')
      })

    this.syncProjects()
      .catch(() => Toast.create.negative('Failed to load projects'))
  },

  methods: {
    ...mapActions([
      'syncProjects',
      'createProject',
      'connectSocket',
      'connectNotificationsChannel'
    ]),

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

    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    }
  }
}
