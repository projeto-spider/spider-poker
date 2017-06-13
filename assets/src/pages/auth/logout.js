import AuthLayout from './layout'

export default {
  name: 'Logout',

  components: {AuthLayout},

  created() {
    this.$store.commit('set_token', '')
    this.$store.commit('set_user', null)
    this.$router.push({name: 'Login'})
  }
}
