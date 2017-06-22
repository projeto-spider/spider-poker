import {Toast, Dialog, Loading} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'EditProjectModal',

  components: {Gravatar},

  props: {
    modal: Object,
    projects: Array
  },

  data: () => ({
    loading: false,
    authorizing: false,
    projectIndexOnList: false,
    checkingAuthorization: false,
    form: {},
    memberToAdd: '',
    members: [],
    errors: {
      name: [],
      display_name: []
    }
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    project() {
      // must compare to false because 0 is a valid index!
      if (this.projectIndexOnList === false)
        return false

      return this.projects[this.projectIndexOnList]
    },

    selected() {
      return !!this.project
    },

    selectOptions() {
      return this.projects
        .map((proj, i) => ({
          label: proj.display_name || proj.name,
          value: i
        }))
    },

    authorized() {
      return this.members
        .some(member =>
          member.user.id === this.loggedUser.id &&
          member.role === 'manager'
        )
    },

    hasPo() {
      return this.members
        .filter(member => member.role === 'po')
        .length
    }
  },

  methods: {
    /* Authorization */
    selectedOrganization() {
      if (this.loading) {
        return
      }

      this.authorizing = true
      this.members = []

      Loading.show({
        delay: 0,
        message: 'Loading data'
      })

      axios.get(`/projects/${this.project.id}/members/`)
        .then(this.handleMembers)
        .catch(this.denyAccess)
    },

    handleMembers(response) {
      this.authorizing = false
      this.form = Object.assign({}, this.project)
      this.members = response.data
      Loading.hide()
    },

    denyAccess() {
      this.authorizing = false
      Loading.hide()
    },

    /* Edition */
    edit() {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        delay: 0,
        message: 'Updating'
      })

      const {name, display_name, votation_time, private: isPrivate} = this.form

      axios.put(`/projects/${this.project.id}`, {
        data: {name, display_name, votation_time, private: isPrivate}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited(response) {
      Toast.create.positive('Updated project successfully')

      this.loading = false
      Loading.hide()

      Object.assign(this.project, response.data)
      this.form = response.data
    },

    handleEditFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to Upadate')

      const errors = error.response.data.errors
      this.errors = {
        name: errors.name || [],
        display_name: errors.display_name || []
      }
      this.loading = false
    },

    closeModal() {
      this.form = Object.assign({}, this.project)
      this.errors = {
        name: [],
        display_name: []
      }
    },

    /* Deletion */
    confirmDeleteProject() {
      Dialog.create({
        title: 'Danger',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: this.deleteProject
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteProject() {
      if (this.loading) {
        return
      }

      Loading.show({
        delay: 0,
        message: 'Deleting'
      })
      this.loading = true

      axios.delete(`/projects/${this.project.id}`)
        .then(this.handleDeleted)
        .catch(this.handleDeleteFail)
    },

    handleDeleted() {
      Toast.create.positive('Deleted project successfully')

      this.loading = false
      Loading.hide()

      this.projects.splice(this.projectIndexOnList, 1)
      this.projectIndexOnList = -1
      this.form = {}
      this.members = []
    },

    handleDeleteFail() {
      Toast.create.negative('Failed to delete project')

      this.loading = false
      Loading.hide()
    },

    /* Member Add */
    searchMembers(query, done) {
      axios.get(`/organizations/${this.project.organization_id}/members`)
        .then(({data}) =>
          data
          .filter(({user}) =>
            !this.members.some(member => member.user.id === user.id)
          )
          .filter(({user}) =>
            user.username.indexOf(query) !== -1 ||
            user.display_name.indexOf(query) !== -1
          )
          .map(({user}) => ({
            value: user.username,
            label: user.display_name,
            secondLabel: user.username,
            stamp: user.id
          }))
        )
        .then(done)
        .catch(() => done([]))
    },

    addMember({stamp: id}) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Adding member',
        delay: 0
      })

      axios.post(`/projects/${this.project.id}/members/`, {
        data: {user_id: id}
      })
        .then(this.handleMemberAdded)
        .catch(this.handleMemberAddFail)
    },

    handleMemberAdded(response) {
      this.loading = false
      Loading.hide()
      this.memberToAdd = ''

      Toast.create.positive('Member added')
      this.members.push(response.data)
    },

    handleMemberAddFail(error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to add member')
    },

    /* Role Update */
    updateRole(member, role) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Updating role',
        delay: 0
      })

      axios.put(`/projects/${this.project.id}/members/${member.user.id}`, {
        data: {role}
      })
        .then((response) => this.handleRoleUpdated(member, response))
        .catch(this.handleRoleUpdateFail)
    },

    handleRoleUpdated(member, response) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Role updated')
      Object.assign(member, response.data)
    },

    handleRoleUpdateFail(error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to update role')
    },

    /* Member Remove */
    removeMember(member, index) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Removing member',
        delay: 0
      })

      axios.delete(`/projects/${this.project.id}/members/${member.user.id}`)
        .then(() => this.handleMemberRemoved(member.user.id))
        .catch(this.handleMemberRemoveFail)
    },

    handleMemberRemoved(userId) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Member removed')
      this.members = this.members.filter(member => member.user.id != userId)
    },

    handleMemberRemoveFail(error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to remove member')
    }
  }
}
