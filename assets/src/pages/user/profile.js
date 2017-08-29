import {Toast, Loading} from 'quasar'
import {mapGetters} from 'vuex'
import axios from 'utils/axios'
import Avatar from 'components/avatar.vue'
import OneBoxLayout from 'components/layout/one-box-layout.vue'

export default {
  name: 'Profile',

  components: {OneBoxLayout, Avatar},

  data() {
    return {
      loading: false,
      user: {},
      userInfo: []
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    currentUserIsSelf() {
      return this.loggedUser.id === this.user.id
    }
  },

  created() {
    if (this.loading) {
      return
    }

    Loading.show({
      message: 'Loading data',
      delay: 0
    })

    axios.get(`/users/${this.$route.params.username}`)
      .then(this.handleSucess)
      .catch(this.handleFail)
  },

  methods: {
    handleSucess(response) {
      this.loading = false
      Loading.hide()

      this.user = response.data
      this.userInfo = [this.user.email, this.user.contact, this.user.location, this.user.url]
    },

    handleFail(error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed load data')
    }
  }
}
