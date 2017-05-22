import R from 'ramda'
import {Auth} from 'app/api'
import store from 'app/store'
import {FormControl} from 'app/components'

export default {
  name: 'LoginPage',

  components: {FormControl},

  data() {
    return {
      username: R.view(R.lensPath(['$route', 'query', 'username']), this) || '',
      password: '',
      status: 'not-asked'
    }
  },

  methods: {
    async submit() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      try {
        const res = await Auth.signin(this.username, this.password)

        store.commit('set_token', res.data.token)
        const userRes = await Auth.me()
        this.$store.commit('set_user', userRes.data)

        this.status = 'success'
        this.$router.push({name: 'home'})
      } catch (res) {
        this.status = 'errored'
      }
    }
  }
}
