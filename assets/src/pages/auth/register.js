import {Toast, Loading} from 'quasar'
import {mapActions} from 'vuex'
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
    ...mapActions(['register']),

    tryRegister() {
      if (this.loading) {
        return
      }

      const {name, password, password_confirmation: confirmation, email} = this

      if (password !== confirmation) {
        return Toast.create.negative('Password and confirmation don\'t match')
      }

      this.loading = true
      Loading.show({
        message: 'Creating account',
        delay: 0
      })

      this.register({name, email, password})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Loading.hide()
      this.$router.push({name: 'Dashboard'})
    },

    handleFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to register')

      const errors = error.response.data.errors
      this.errors = {
        name: errors.name || [],
        password: errors.password || [],
        email: errors.email || []
      }
      this.loading = false
    }
  }
}
