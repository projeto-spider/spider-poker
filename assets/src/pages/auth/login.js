import {Toast, Loading} from 'quasar'
import axios from 'utils/axios'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Login',

  components: {OneBoxLayout},

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
      Loading.show({
        message: 'Logging in',
        delay: 0
      })
      const {username, password} = this

      axios.post('/sessions', {data: {username, password}})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Loading.hide()
      this.$store.commit('set_token', response.data.token)

      axios.get('/sessions')
        .then(response => {
          this.$store.commit('set_user', response.data)
          this.$router.push({name: 'Dashboard'})
        })
    },

    handleFail(response) {
      Loading.hide()
      Toast.create.negative('Failed to login')
      this.loading = false
    }
  }
}
