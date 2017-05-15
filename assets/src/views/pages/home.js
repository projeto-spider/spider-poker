import {mapGetters} from 'vuex'
import Vue from 'vue'
import {HeroTitle, Gravatar} from 'app/components'
import {Users} from 'app/api'

var VuePaginate = require('vue-paginate')
Vue.use(VuePaginate)

const TAB = {
  0: 'all',
  all: 0,

  1: 'organization',
  organization: 1,

  2: 'project',
  project: 2
}

const mockItems = [
  {name: 'Planning Poker', type: 'project'},
  {name: 'Projeto Spider', type: 'organization'},
  {name: 'Youtube', type: 'project'}
]

export default {
  name: 'HomeView',

  components: {HeroTitle, Gravatar},

  data() {
    return {
      users: [],
      paginate: ['profiles'],

      currentTab: TAB.all,

      tabs: [
        'All',
        'Organizations',
        'Projects'
      ],

      itemClasses: {
        organization: {'fa-code': true},
        project: {'fa-book': true}
      }
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated']),

    items() {
      const currentTab = this.currentTab

      if (currentTab === TAB.all) {
        return mockItems
      }

      return mockItems
        .filter(item => TAB[item.type] === currentTab)
    }
  },

  methods: {
    changeTab(index) {
      this.currentTab = index
    }
  },

  async created() {
    const res = await Users.all()
    this.users = res.data
  }
}
