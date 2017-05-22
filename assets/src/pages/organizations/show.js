import {mapGetters} from 'vuex'
import R from 'ramda'
import {HeroTitle} from 'app/components'
import {Organizations, Users} from 'app/api'

export default {
  name: 'OrganizationShowPage',

  components: {HeroTitle},

  data() {
    return {
      memberships: [],

      status: {
        organization: 'not-asked',
        members: 'not-asked',
        addMember: 'not-asked'
      },

      memberToAdd: '',
      organization: null,
      projects: []
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    isAdmin() {
      if (!this.loggedUser.id) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.role === 'admin' && member.user.id === this.loggedUser.id)
        .length
    },

    isMember() {
      if (!this.loggedUser.id) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.user.id === this.loggedUser.id)
        .length
    }
  },

  created() {
    this.status.organization = 'loading'

    Organizations.show(this.$route.params.organization)
      .then(({data: organization}) => {
        this.status.organization = 'success'
        this.organization = organization

        this.status.members = 'loading'
        return Organizations.members.all(this.organization.id)
      })
      .then(({data: members}) => {
        this.status.members = 'success'
        this.memberships = members
      })
      .catch(() => {
        this.status.organization = 'errored'
      })
  },

  methods: {
    roleToText(role) {
      switch (role) {
        case 'admin':
          return 'Adiminister'

        default:
          return 'Member'
      }
    },

    async submit() {
      if (this.status.addMember === 'loading') {
        return
      }

      this.status.addMember = 'loading'

      const res = await Users.show(this.memberToAdd)

      if (res.data.length === 0) {
        this.status.addMember = 'errored'
        return
      }

      const userId = R.prop('id', res.data[0])

      const orgId = R.prop('id', this.organization)

      try {
        const resNewMember = await Organizations.members.create(orgId, userId, 'member')

        this.memberships.push(resNewMember.data)

        this.status.addMember = 'success'

        this.memberToAdd = ''
      } catch (res) {
        this.status.addMember = 'errored'
      }
    },

    async removeMember(userId) {
      if (confirm('Are you sure you want to remove this member?')) {
        const orgId = this.organization.id

        await Organizations.members.delete(orgId, userId)

        this.memberships = this.memberships
        .filter(member => member.user.id !== userId)
      }
    }
  }
}
