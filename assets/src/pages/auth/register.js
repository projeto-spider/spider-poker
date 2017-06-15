import {Toast} from 'quasar'
import axios from 'utils/axios'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

const emptyErrors = {
  username: [],
  password: [],
  password_confirmation: [],
  email: []
}

export default {
  name: 'Register',

  components: {OneBoxLayout},

  data: () => ({
    loading: false,
    username: '',
    password: '',
    password_confirmation: '',
    email: '',
    errors: emptyErrors
  }),

  methods: {
    register() {
      if (this.loading) {
        return
      }

      this.loading = true
      const {username, password, password_confirmation, email} = this

      axios.post('/users', {data: {username, password, password_confirmation, email}})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      this.$router.push({name: 'Login'})
    },

    handleFail(error) {
      Toast.create.negative('Failed to register')

      const errors = error.response.data.errors
      this.errors = {
        username: errors.username || [],
        password: errors.password || [],
        password_confirmation: errors.password_confirmation || [],
        email: errors.email || []
      }
      this.loading = false
    }
  }
}
