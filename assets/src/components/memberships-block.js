import {Users} from 'app/api'

export default {
  name: 'MembershipsBlock',

  data() {
    return {
      status: {
        organization: 'not-asked',
        project: 'not-asked'
      },

      organizations: [],
      projects: []
    }
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  created() {
    this.status.organization = 'loading'
    Users.organizations.all(this.user.id)
    .then(({data: organizations}) => {
      this.status.organization = 'success'
      this.organizations = organizations
    })

    this.status.project = 'loading'
    Users.projects.all(this.user.id)
    .then(({data: projects}) => {
      this.status.project = 'success'
      this.projects = projects
    })
    .catch((err) => this.status.organization = 'errored')
  }
}
