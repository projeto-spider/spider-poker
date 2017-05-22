import R from 'ramda'
import {mapGetters} from 'vuex'
import {HeroTitle} from 'app/components'
import {Projects, Users} from 'app/api'

export default {
  name: 'ProjectShowPage',

  components: {HeroTitle},

  data() {
    return {
      memberships: [],

      status: {
        project: 'not-asked',
        members: 'not-asked',
        addMember: 'not-asked'
      },

      memberToAdd: '',
      memberToAddRole: 'team',
      project: null
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    isManager() {
      if (!this.loggedUser.id) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.role === 'manager' && member.user.id === this.loggedUser.id)
        .length
    },

    hasPo() {
      return this.memberships
        .filter(member => member.role === 'po')
        .length
    }
  },

  async created() {
    this.status.project = 'loading'

    const projectName = this.$route.params.project

    const {data: projs} = await Projects.show(projectName)

    if (projs.length === 0) {
      this.status.project = 'errored'
      return
    }

    this.status.project = 'success'

    this.project = projs[0]

    this.status.members = 'loading'

    const {data: memberships} = await Projects.members.all(this.project.id)

    this.memberships = memberships

    this.status.members = 'success'
  },

  methods: {
    roleToText(role) {
      switch (role) {
        case 'po':
          return 'Product owner'

        case 'manager':
          return 'Manager'

        default:
          return 'Team member'
      }
    },

    async submit() {
      if (this.status.addMember === 'loading') {
        return
      }

      this.status.addMember = 'loading'

      const res = await Users.show(this.memberToAdd)

      if (res.error) {
        this.status.addMember = 'errored'
        return
      }

      const userId = R.prop('id', res.data)

      const projId = R.prop('id', this.project)

      const role = R.prop('memberToAddRole', this)
      try {
        const resNewMember = await Projects.members.create(projId, userId, role)

        this.memberships.push(resNewMember.data)

        this.status.addMember = 'success'

        this.memberToAdd = ''
        this.memberToAddRole = 'team'
      } catch (res) {
        this.status.addMember = 'errored'
      }
    },

    async removeMember(userId) {
      if (confirm('Are you sure you want to remove this member?')) {
        const projId = this.project.id

        await Projects.members.delete(projId, userId)

        this.memberships = this.memberships
        .filter(member => member.user.id !== userId)
      }
    }
  }
}
