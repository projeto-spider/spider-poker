<template>
  <main>
    <hero-title text="Home Page"/>

    <div class="container">
      <div class="columns">
        <div class="column is-two-thirds">
          <article v-for="update in feed" class="media">
            <router-link
              :to="{name: 'userShow', params: {username: update.username}}"
            >
              <figure class="media-left">
                <p class="image is-64x64">
                  <img :src="update.image">
                </p>
              </figure>
            </router-link>

            <div class="media-content">
              <p>
                <router-link
                  :to="{name: 'userShow', params: {username: update.username}}"
                >
                  {{update.name}}
                </router-link>
                <small>{{update.timeago}}</small>
                <p>
                  <router-link
                    :to="{name: 'userShow', params: {username: update.username}}"
                    class="is-primary"
                  >
                    @{{update.username}}
                  </router-link>
                </p>
              </p>

              <p>{{update.did}}</p>
            </div>
          </article>
        </div>

        <div class="column">
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
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import Faker from 'faker/locale/en'
  import {HeroTitle} from 'app/components'

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

  let hoursAgo = 2;

  const feed = Array.from(Array(10))
    .map(() => ({
      image: Faker.image.avatar(),
      username: Faker.internet.userName(),
      name: `${Faker.name.findName()}`,
      timeago: `${hoursAgo++}h ago`,
      did: Faker.lorem.sentence()
    }))

  export default {
    name: 'HomeView',

    components: {HeroTitle},

    data() {
      return {
        feed,

        currentTab: TAB.all,

        tabs: [
          "All",
          "Organizations",
          "Projects"
        ],

        itemClasses: {
          organization: {'fa-code': true},
          project: {'fa-book': true}
        }
      }
    },

    computed: {
      items() {
        const currentTab = this.currentTab;

        if (currentTab === TAB.all) {
          return mockItems;
        }

        return mockItems
          .filter(item => TAB[item.type] === currentTab)
      }
    },

    methods: {
      changeTab(index) {
        this.currentTab = index;
      }
    }
  }
</script>
