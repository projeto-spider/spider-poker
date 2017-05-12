<template>
  <main>
    <hero-title text="Home Page"/>

    <div class="container">
      <div class="columns">
        <div class="column">
          <paginate
            name="profiles"
            :list="users"
            :per="4"
            tag="div"
            class="paginate-list"
          >
            <article v-for="user in paginated('profiles')" class="media">
              <router-link
                :to="{name: 'userShow', params: {username: user.username}}"
              >
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img :src="gravatar(user.email)">
                  </p>
                </figure>
              </router-link>

              <div class="media-content">
                <p>
                  <router-link
                    :to="{name: 'userShow', params: {username: user.username}}"
                  >
                    {{user.displayName}}
                  </router-link>
                  <p>
                    <router-link
                      :to="{name: 'userShow', params: {username: user.username}}"
                      class="is-primary"
                    >
                      @{{user.username}}
                    </router-link>
                  </p>
                </p>

                <p v-if='user.bio'>{{user.bio}}</p>
              </div>
            </article>
          </paginate>
          <br/>
          <paginate-links
            for="profiles"
            class="column is-offset-5 control is-horizontal"
            :simple="{
            next: '|     Next »',
            prev: '« Back   |'
            }"
          >
          </paginate-links>
        </div>

        <div v-if='isAuthenticated' class="column is-one-third">
          <router-link
            :to="{name: 'organizationCreate'}"
            class="button is-primary is-outlined is-fullwidth"
          >
            <span class="icon is-small">
              <i class="fa fa-building"></i>
            </span>
            <span>Create a new organization</span>
          </router-link>
          <br />

            <nav class="panel">
              <p class="panel-heading">
                Quick Links
              </p>

              <div class="panel-block">
                <p class="control has-icon">
                  <input class="input is-small" type="text" placeholder="Search"/>

                  <span class="icon is-small">
                    <i class="fa fa-search"/>
                  </span>
                </p>
              </div>

              <p class="panel-tabs">
                <a
                  v-for="(tab, index) in tabs"
                  :class="{'is-active': currentTab === index}"
                  @click="changeTab(index)"
                >
                  {{tab}}
                </a>
              </p>

              <a v-for="item in items" class="panel-block">
                <span class="panel-icon">
                  <i class="fa" :class="itemClasses[item.type]" />
                </span>
                {{item.name}}
              </a>
            </nav>
            <br />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import {mapGetters} from 'vuex'
  import gravatar from 'gravatar'
  import Vue from 'vue'
  import {HeroTitle} from 'app/components'
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

    components: {HeroTitle},

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
      gravatar: gravatar.url,

      changeTab(index) {
        this.currentTab = index
      }
    },

    async created() {
      const res = await Users.all()
      this.users = res.data
    }
  }
</script>
