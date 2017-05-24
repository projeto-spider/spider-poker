import {mapGetters, mapActions, mapState} from 'vuex'
import R from 'ramda'
import store from 'app/store'
import {Users} from 'app/api'
import {insertChangesetErrors} from 'app/utils'
import {FormControl, Gravatar, UserBlock} from 'app/components'

const emptyErrors = {
  bio: [],
  contact: [],
  location: [],
  name: [],
  url: []
}

const userIdView = R.view(R.lensPath(['user', 'id']))

export default {
  name: 'UserEditPage',

  components: {FormControl, Gravatar, UserBlock},

  data() {
    return {
      status: 'not-asked',

      errors: emptyErrors
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),
    ...mapState({
      user: R.pipe(
        R.view(R.lensPath(['auth', 'user'])),
        R.clone
      )
    })
  },

  async created() {
    this.hideFooter()
    this.enableFullheightPage()
  },

  destroy() {
    this.showFooter()
    this.disableFullheightPage()
  },

  methods: {
    ...mapActions(['hideFooter', 'showFooter', 'enableFullheightPage', 'disableFullheightPage']),

    async submit() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      const id = userIdView(this)

      const attributes = R.pipe(
        R.view(R.lensPath(['user'])),
        R.pick(['bio', 'contact', 'location', 'name', 'url'])
      )(this)

      try {
        const res = await Users.update(id, attributes)
        const user = res.data

        this.status = 'success'

        this.$router.push({name: 'home'})
        store.commit('set_user', {
          ...this.user,
          user
        })

        this.errors = emptyErrors
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    },

    async deleteUser() {
      if (confirm('Are you sure you want to delete your account?')) {
        const id = userIdView(this)

        await Users.delete(id)

        store.commit('set_token', '')
        store.commit('set_user', null)
        this.$router.push({name: 'home'})
      }
    }
  }
}
