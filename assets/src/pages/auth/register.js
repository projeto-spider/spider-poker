import {Toast, Loading} from 'quasar'
import axios from 'utils/axios'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Register',

  components: {OneBoxLayout},

  data: () => ({
    loading: false,
    name: '',
    password: '',
    password_confirmation: '',
    email: '',
    errors: {
      name: [],
      password: [],
      password_confirmation: [],
      email: []
    }
  }),

  methods: {
    register() {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Creating account',
        delay: 0
      })
      const {name, password, password_confirmation, email} = this

      axios.post('/users', {data: {name, password, password_confirmation, email}})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Loading.hide()
      this.$router.push({name: 'Login'})
    },

    handleFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to register')

      const errors = error.response.data.errors
      this.errors = {
        name: errors.name || [],
        password: errors.password || [],
        password_confirmation: errors.password_confirmation || [],
        email: errors.email || []
      }
      this.loading = false
    }
  }
}
