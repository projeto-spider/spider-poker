import R from 'ramda'
import {Organizations} from 'app/api'
import {HeroTitle, FormControl} from 'app/components'
import {insertChangesetErrors} from 'app/utils'

const emptyErrors = {
  name: [],
  displayName: [],
  description: [],
  private: []
}

const organizationIdView = R.view(R.lensPath(['organization', 'id']))

export default {
  name: 'ProjectCreatePage',

  components: {
    HeroTitle, FormControl
  },

  data() {
    return {
      name: '',
      displayName: '',
      description: '',
      private: '0',
      status: {
        organization: 'not-asked',
        project: 'not-asked'
      },
      organization: null,
      errors: emptyErrors
    }
  },

  created() {
    this.status.organization = 'loading'

    Organizations.show(this.$route.params.organization)
      .then(({data: organization}) => {
        this.status.organization = 'success'
        this.organization = organization
      })
      .catch(() => this.status.organization = 'errored')
  },

  methods: {
    async submit() {
      if (this.status.project === 'loading') {
        return
      }

      if (this.organization === null) {
        this.status.organization = 'errored'
      }

      this.status.project = 'loading'

      const orgId = organizationIdView(this)

      const attributes = R.pick([
        'name', 'displayName', 'description', 'private'
      ], this)

      try {
        const res = await Organizations.projects.create(orgId, attributes)

        const name = R.prop('name', res.data)

        this.$router.push({name: 'projectShow', params: {project: name}})

        this.status.project = 'success'
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status.project = 'errored'
      }
    }
  }
}
