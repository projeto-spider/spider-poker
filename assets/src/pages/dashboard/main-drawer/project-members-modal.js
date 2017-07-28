import {Toast, Dialog, Loading} from 'quasar'
import {mapGetters, mapActions} from 'vuex'
import axios from 'utils/axios'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'MainDrawerProject',

  components: {Gravatar},

  props: {
    modal: Object,
    project: Object
  },

  data: () => ({
    loading: false,
    memberToAdd: '',
    members: []
  }),

  computed: {
    ...mapGetters(['loggedUser']),

    loggedUserIsManager() {
      return this.loggedUser.id === this.project.manager_id
    },

    hasPo() {
      return !!this.project.po_id
    }
  },

  methods: {
    ...mapActions(['updateProject']),

    sync() {
      Loading.show({
        delay: 0,
        message: 'Syncing members'
      })

      axios.get(`/projects/${this.project.id}/members/`)
        .then(this.handleMembers)
        .catch(this.handleMembersLoadFail)
    },

    handleMembers({data}) {
      this.members = data
      Loading.hide()
    },

    handleMembersLoadFail() {
      Loading.hide()
      Toast.create.negative('Failed to load members')
    },

    /* Member Add */
    searchMembers(query, done) {
      // TODO: properly search
      axios.get(`/users`)
        .then(({data}) =>
          data
          .filter((user) =>
            !this.members.some(member => member.id === user.id)
          )
          .filter((user) =>
            user.name.indexOf(query) !== -1 ||
            user.email.indexOf(query) !== -1
          )
          .map((user) => ({
            value: user.id,
            label: user.name,
            secondLabel: user.email,
            stamp: user.id
          }))
        )
        .then(done)
        .catch(() => done([]))
    },

    addMember({stamp: id}) {
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

    handleMemberAdded({data}) {
      Loading.hide()
      this.memberToAdd = ''
      Toast.create.positive('Member added')
      this.members.push(data)
    },

    handleMemberAddFail() {
      Loading.hide()
      Toast.create.negative('Failed to add member')
    },

    /* Role Update */
    updateRole(member, role) {
      const data = {[`${role}_id`]: member.id}
      this.updateProject({projectId: this.project.id, data})
        .then(() => Toast.create.positive('Role updated'))
        .catch(() => Toast.create.negative('Failed to update role'))
    },

    revokeRole(member, role) {
      const data = {[`${role}_id`]: null}
      this.updateProject({projectId: this.project.id, data})
        .then(() => Toast.create.positive('Role updated'))
        .catch(() => Toast.create.negative('Failed to update role'))
    },

    /* Member Remove */
    removeMember(member) {
      Loading.show({
        message: 'Removing member',
        delay: 0
      })

      axios.delete(`/projects/${this.project.id}/members/${member.id}`)
        .then(() => this.handleMemberRemoved(member.id))
        .catch(this.handleMemberRemoveFail)
    },

    handleMemberRemoved(userId) {
      Loading.hide()
      Toast.create.positive('Member removed')
      this.members = this.members.filter(member => member.id !== userId)
    },

    handleMemberRemoveFail() {
      Loading.hide()
      Toast.create.negative('Failed to remove member')
    },

    /* Helpers */
    isPo(member) {
      return member.id === this.project.po_id
    },

    isManager(member) {
      return member.id === this.project.manager_id
    }
  }
}
