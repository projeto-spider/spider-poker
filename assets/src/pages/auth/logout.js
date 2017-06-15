import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Logout',

  components: {OneBoxLayout},

  created() {
    this.$store.commit('set_token', '')
    this.$store.commit('set_user', null)
    this.$router.push({name: 'Login'})
  }
}
