import {Projects, Organizations} from 'app/api'
import {HeroTitle} from 'app/components'

export default {
  name: 'projectsList',

  components: {HeroTitle},

  async created() {
    if (this.$route.name === 'organizationProjectsList') {
      const orgName = this.$route.params.organization
      const {data} = await Organizations.show(orgName)

      if (data.length === 0) {
        this.status = 'errored'
        return
      }

      const organization = data[0]

      const res = await Organizations.projects.all(organization.id)
      this.projects = res.data
    } else {
      const res = await Projects.all()
      this.projects = res.data
    }
  },

  data() {
    return {
      projects: [],
      status: 'not-asked'
    }
  },

  methods: {
  }
}
