import {Toast} from 'quasar'
import {mapActions} from 'vuex'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'SocialAuthCallback',

  components: {OneBoxLayout},

  created() {
    const {token, error} = this.$route.query 

    if (token) {
      return this.loginWithToken(token)
        .then(() => {
          this.$router.push({name: 'Dashboard'})
        })
        .catch(() => {
          Toast.create.negative('Something went wrong')
          this.$router.push({name: 'Login'})
        })
    }

    if (error === "email_used") {
      Toast.create.negative('Email already being used')
    } else {
      Toast.create.negative('Something went wrong')
    }

    this.$router.push({name: 'Login'})
  },

  methods: {
    ...mapActions(['loginWithToken'])
  }
}
