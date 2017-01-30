<template>
  <main>
    <hero-title v-if='user' :text="user.profile.name" :subtitle="`@${user.username}`"/>

    <div v-if='user' class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="image">
            <img :src="gravatar(user.email)" alt="Avatar"/>
          </div>

          <p v-if="user.profile.bio">{{user.profile.bio}}</p>

          <div v-if="userInfos" class="panel">
            <p v-for="info in userInfos" class="panel-block">
              <span class="panel-icon">
                <i class="fa" :class="userInfoIconClasses[info.key]" />
              </span>
              {{info.text}}
            </p>
          </div>
        </div>

        <div class="column">
          <article v-for="org in organizations" class="media">
            <div class="media-content">
              <div class="content">
                <i class="fa fa-group" />&nbsp;
                <strong>{{org.displayName}}</strong>
                <p>{{org.info}}</p>
              </div>

              <article v-for="proj in org.projects" class="media">
                <!-- This empty picture pulls the nested content right -->
                <figure class="media-left"><p class="image is-48x48"></p></figure>

                <div class="media-content">
                  <i class="fa fa-list-alt" />&nbsp;
                  <strong>{{proj.displayName}}</strong>
                  <p>{{proj.info}}</p>
                </div>
              </article>
            </div>
          </article>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import R from 'ramda'
  import Faker from 'faker/locale/en'
  import gravatar from 'gravatar'
  import {Users} from 'app/api'
  import {HeroTitle} from 'app/components'

  const random = (low, high) => Math.floor(Math.random() * high) + low
  const range = length => Array.from({length})

  const generateOrganizations = () =>
    range(random(2, 10))
      .map(() => ({
        displayName: Faker.company.companyName(),
        info: Faker.lorem.paragraph(),
        projects: range(random(1, 5))
                    .map(() => ({
                      displayName: Faker.commerce.productName(),
                      info: Faker.lorem.sentence()
                    }))
      }))

  export default {
    name: 'UserShowView',

    components: {HeroTitle},

    data() {
      return {
        user: null,

        organizations: generateOrganizations(),

        userInfoIconClasses: {
          location: {'fa-map-marker': true},
          email: {'fa-envelope': true},
          url: {'fa-globe': true},
        }
      }
    },

    methods: {
      gravatar(email) {
        return gravatar.url(email, {size: 512})
      }
    },

    computed: {
      userInfos() {
        const profile = R.view(R.lensPath(['user', 'profile']))(this)

        return R.pipe(
          R.prop('user'),
          R.pick(['email']),
          R.merge(
            R.pick(['location', 'url'], profile)
          ),
          R.filter(Boolean),
          R.toPairs,
          R.map(([key, text]) => ({text, key})),
        )(this)
      }
    },

    created() {
      Users.show(this.$route.params.username)
        .then(res => {
          this.user = res[0]
        })
        .catch(() => {
          console.error('Deu erro')
        })
    }
  }
</script>
