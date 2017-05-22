import R from 'ramda'
import {Organizations} from 'app/api'
import {HeroTitle, FormControl} from 'app/components'
import {insertChangesetErrors} from 'app/utils'

const emptyErrors = {
  name: [],
  displayName: [],
  description: [],
  location: [],
  url: [],
  private: []
}

export default {
  name: 'OrganizationsCreatePage',

  components: {
    HeroTitle, FormControl
  },

  data() {
    return {
      name: '',
      displayName: '',
      description: '',
      location: '',
      url: '',
      private: '0',
      status: 'not-asked',
      errors: emptyErrors
    }
  },

  methods: {
    async submit() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      const attributes = R.pick([
        'name', 'displayName', 'description', 'location', 'url', 'private'
      ], this)

      try {
        const org = await Organizations.create(attributes)

        const name = R.prop('name', org)

        this.$router.push({name: 'organizationShow', params: {organization: name}})

        this.status = 'success'
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    }
  }
}
