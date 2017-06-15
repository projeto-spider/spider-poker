import {Toast, Dialog, Loading} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'EditOrganizationModal',

  components: {Gravatar},

  props: {
    modal: Object,
    organizations: Array
  },

  data: () => ({
    loading: false,
    authorizing: false,
    organizationIndexOnList: false,
    checkingAuthorization: false,
    form: {},
    memberToAdd: '',
    members: []
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    organization() {
      // must compare to false because 0 is a valid index!
      if (this.organizationIndexOnList === false)
        return false

      return this.organizations[this.organizationIndexOnList]
    },

    selected() {
      return !!this.organization
    },

    selectOptions() {
      return this.organizations
        .map((org, i) => ({
          label: org.display_name || org.name,
          value: i
        }))
    },

    authorized() {
      return this.members
        .some(member =>
          member.user.id === this.loggedUser.id &&
          member.role === 'admin'
        )
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

      axios.get(`/organizations/${this.organization.id}/members/`)
        .then(this.handleMembers)
        .catch(this.denyAccess)
    },

    handleMembers(response) {
      this.authorizing = false
      this.form = Object.assign({}, this.organization)
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


      const {name, display_name, private: isPrivate} = this.form

      axios.put(`/organizations/${this.organization.id}`, {
        data: {name, display_name, private: isPrivate}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited(response) {
      Toast.create.positive('Updated organization successfully')

      this.loading = false
      Loading.hide()

      Object.assign(this.organization, response.data)
      this.form = response.data
    },

    handleEditFail(error) {
      this.loading = false
      Loading.hide()

      // TODO: properly handle errors
      Toast.create.negative(
        error.response.data.errors.name
          .map(msg => 'Name ' + msg)
          .join('\n')
      )
    },

    /* Deletion */
    confirmDeleteOrganization() {
      Dialog.create({
        title: 'Danger',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: this.deleteOrganization
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteOrganization() {
      if (this.loading) {
        return
      }

      Loading.show({
        delay: 0,
        message: 'Deleting'
      })
      this.loading = true

      axios.delete(`/organizations/${this.organization.id}`)
        .then(this.handleDeleted)
        .catch(this.handleDeleteFail)
    },

    handleDeleted() {
      Toast.create.positive('Deleted organization successfully')

      this.loading = false
      Loading.hide()

      this.organizations.splice(this.organizationIndexOnList, 1)
      this.organizationIndexOnList = -1
      this.form = {}
      this.members = []
    },

    handleDeleteFail() {
      Toast.create.negative('Failed to delete organization')

      this.loading = false
      Loading.hide()
    },

    /* Member Add */
    searchMembers(query, done) {
      axios.get(`/users?search[username]=${query}`)
        .then(({data}) =>
          data
          .filter(user =>
            !this.members.some(member => member.user.id === user.id)
          )
          .map(user => ({
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

      axios.post(`/organizations/${this.organization.id}/members/`, {
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

      axios.put(`/organizations/${this.organization.id}/members/${member.user.id}`, {
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

      axios.delete(`/organizations/${this.organization.id}/members/${member.user.id}`)
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
