import {Toast, Loading} from 'quasar'
import {mapActions} from 'vuex'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Login',

  components: {OneBoxLayout},

  data: () => ({
    loading: false,
    email: localStorage.getItem('lastUsedEmail') || '',
    password: ''
  }),

  methods: {
    ...mapActions(['login']),

    tryLogin() {
      if (this.loading) {
        return
      }

      this.loading = true

      Loading.show({
        message: 'Logging in',
        delay: 0
      })
      const {email, password} = this

      this.login({email, password})
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      Loading.hide()
      localStorage.setItem('lastUsedEmail', this.email)
      this.$router.push({name: 'Dashboard'})
    },

    handleFail(response) {
      Loading.hide()
      Toast.create.negative('Failed to login')
      this.loading = false
    }
  }
}
