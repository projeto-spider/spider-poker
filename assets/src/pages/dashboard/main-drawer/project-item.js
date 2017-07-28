import {Dialog, Toast} from 'quasar'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import ProjectMembers from './project-members.vue'

export default {
  name: 'ProjectItem',

  components: {
    ProjectMembers
  },

  props: {
    project: Object
  },

  computed: {
    ...mapGetters(['loggedUser', 'selectedProject']),

    isManager() {
      return this.loggedUser.id === this.project.manager_id
    }
  },

  methods: {
    ...mapMutations(['selectProject']),
    ...mapActions(['updateProject', 'deleteProject', 'leaveProject']),

    promptProjectEdit() {
      this.$refs.popover.close()

      Dialog.create({
        title: 'Editing Project',

        form: {
          name: {
            type: 'textbox',
            label: 'Name',
            model: this.project.name
          },

          organization: {
            type: 'textbox',
            label: 'Organization name (optional)',
            model: this.project.organization
          },
        },

        buttons: [
          'Cancel',
          {
            label: 'Update',
            classes: 'info',
            handler: data =>
              this.updateProject({projectId: this.project.id, data})
                .then(() => Toast.create.positive('Updated project successfully'))
                .catch(() => Toast.create.negative('Failed to update project'))
          }
        ]
      })
    },

    confirmDeleteProject() {
      this.$refs.popover.close()

      Dialog.create({
        title: 'Danger',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: () =>
              this.deleteProject(this.project.id)
                .then(() => Toast.create.positive('Deleted project successfully'))
                .catch(() => Toast.create.negative('Failed to delete project'))
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    confirmLeaveProject() {
      this.$refs.popover.close()

      Dialog.create({
        title: 'Danger',
        message: "You are leaving this project",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: () =>
              this.leaveProject(this.project.id)
                .then(() => Toast.create.positive('Left project'))
                .catch(() => Toast.create.negative('Failed to leave project'))
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    }
  }
}
