import {Toast} from 'quasar'
import axios from 'utils/axios'
import AuthLayout from './layout'

export default {
  name: 'Login',

  components: {AuthLayout},

  data: () => ({
    loading: false,
    username: '',
    password: ''
  }),

  methods: {
    login() {
      if (this.loading) {
        return
      }

      this.loading = true
      const {username, password} = this

      axios.post('/sessions', {data: {username, password}})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      this.$store.commit('set_token', response.data.token)

      axios.get('/sessions')
        .then(response => {
          this.$store.commit('set_user', response.data)
          this.$router.push({name: 'Dashboard'})
        })
    },

    handleFail(response) {
      Toast.create.negative('Failed to login')
      this.loading = false
    }
  }
}
