import {Toast, Loading} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'UserSettings',

  components: {OneBoxLayout},

  data: () => ({
    loading: false,
    form: {},
    errors: {
      display_name: [],
      url: []
    }
  }),

  computed: mapGetters(['loggedUser']),

  created() {
    this.form = Object.assign({}, this.loggedUser)
  },

  methods: {
    update() {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Updating account',
        delay: 0
      })

      const {display_name, bio, contact, location, url} = this.form

      axios.put(`/users/${this.loggedUser.id}`, {
        data: {display_name, bio, contact, location, url}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited(response) {
      Toast.create.positive('Updated profile successfully')

      this.loading = false
      Loading.hide()

      this.$store.commit('set_user', response.data)

      this.$router.push({name: 'Dashboard'})
    },

    handleEditFail(error) {
      Loading.hide()
      Toast.create.negative('Failed to Upadate')

      const errors = error.response.data.errors
      this.errors = {
        display_name: errors.display_name || [],
        url: errors.url
      }
      this.loading = false
    }
  }
}
