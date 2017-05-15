import R from 'ramda'
import {Organizations} from 'app/api'
import {insertChangesetErrors} from 'app/utils'
import {HeroTitle, ErrorableInput} from 'app/components'

const emptyErrors = {
  displayName: [],
  description: [],
  contact: [],
  location: [],
  url: [],
  private: []
}

const organizationIdView = R.view(R.lensPath(['organization', 'id']))

export default {
  name: 'OrganizationEditView',

  components: {
    HeroTitle, ErrorableInput
  },

  data() {
    return {
      status: 'not-asked',
      organization: null,
      private: '',

      errors: emptyErrors
    }
  },

  created() {
    this.status = 'loading'

    Organizations.show(this.$route.params.organization)
      .then(({data: organization}) => {
        this.status = 'success'
        this.organization = organization
      })
      .catch(() => {
        this.status = 'errored'
      })
  },

  methods: {
    async submit() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      const id = organizationIdView(this)

      const attributes = R.pipe(
        R.view(R.lensPath(['organization'])),
        R.pick(['displayName', 'description', 'location', 'url', 'private'])
      )(this)

      attributes.display_name = attributes['display-name']

      try {
        await Organizations.update(id, attributes)

        this.status = 'success'

        this.errors = emptyErrors
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    },

    async deleteOrganization() {
      if (confirm('Are you sure you want to delete this organization?')) {
        const id = organizationIdView(this)

        await Organizations.delete(id)

        this.$router.push({name: 'home'})
      }
    }
  }
}