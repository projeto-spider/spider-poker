import {mapActions} from 'vuex'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Logout',

  components: {OneBoxLayout},

  created() {
    this.logout()
    this.$router.push({name: 'Login'})
  },

  methods: {
    ...mapActions(['logout'])
  }
}
