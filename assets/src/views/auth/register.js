import R from 'ramda'
import {Users} from 'app/api'
import {ErrorableInput} from 'app/components'
import {insertChangesetErrors} from 'app/utils'

const emptyErrors = {
  username: [],
  email: [],
  password: [],
  password_confirmation: []
}

export default {
  name: 'RegisterView',

  components: {ErrorableInput},

  data() {
    return {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
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
        'username', 'email', 'password', 'password_confirmation'
      ], this)

      try {
        const res = await Users.create(attributes)

        const username = R.view(R.lensPath(['data', 'attributes', 'username']), res)
        this.$router.push({name: 'login', query: {username}})

        this.status = 'success'
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    }
  }
}
