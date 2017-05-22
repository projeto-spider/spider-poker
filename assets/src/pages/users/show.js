import {mapGetters} from 'vuex'
import R from 'ramda'
import {Users, Organizations} from 'app/api'
import {HeroTitle, Gravatar} from 'app/components'

export default {
  name: 'UserShowPage',

  components: {HeroTitle, Gravatar},

  data() {
    return {
      status: {
        users: 'not-asked',
        organization: 'not-asked',
        project: 'not-asked'
      },

      user: null,
      organizations: [],
      projects: [],

      userInfoIconClasses: {
        location: {'fa-map-marker': true},
        email: {'fa-envelope': true},
        url: {'fa-globe': true}
      }
    }
  },

  computed: {
    ...mapGetters(['loggedUser']),

    currentUserIsSelf() {
      return this.loggedUser.id === this.user.id
    },

    userInfos() {
      const profile = R.view(R.lensPath(['user', 'profile']))(this)

      return R.pipe(
        R.prop('user'),
        R.pick(['email', 'location', 'url']),
        R.filter(Boolean),
        R.toPairs,
        R.map(([key, text]) => ({text, key})),
      )(this)
    }
  },

  created() {
    Users.show(this.$route.params.username)
      .then(({data: user}) => {
        this.status.organization = 'success'
        this.user = user

        this.status.organization = 'loading'
        return Users.organizations.all(user.id)
      })
      .then(({data: organizations}) => {
        this.status.organization = 'success'
        this.organizations = organizations

        this.status.project = 'loading'
        return Users.projects.all(this.user.id)
      })
      .then(({data: projects}) => {
        this.status.project = 'success'
        this.projects = projects
      })
      .catch((err) => this.status.organization = 'errored')
  }
}
