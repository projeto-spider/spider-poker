<template>
  <main>
    <hero-title
      v-if='user'
      :text="user.name"
      :subtitle="`@${user.username}`"
    />

    <hero-title
      v-if="status === 'errored'"
      text="User does not exist"
      color="danger"
    />

    <div v-if='user' class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="image">
            <img :src="gravatar(user.email)" alt="Avatar"/>
          </div>

          <p v-if="user.bio">{{user.bio}}</p>

          <div v-if="userInfos" class="panel">
            <p v-for="info in userInfos" class="panel-block">
              <span class="panel-icon">
                <i class="fa" :class="userInfoIconClasses[info.key]" />
              </span>
              {{info.text}}
            </p>
          </div>

          <router-link
            v-if="currentUserIsSelf"
            :to="{name: 'userEdit'}"
            class="button is-info is-outlined is-fullwidth"
          >
            <span class="icon is-small">
              <i class="fa fa-cog"></i>
            </span>

            <span>Edit profile</span>
          </router-link>
        </div>

        <div class="column">
          <article v-for="org in organizations" class="media">
            <div class="media-content">
              <div class="content">
                <div class="icon is-small">
                  <i class="fa fa-group" />&nbsp;
                </div>
                <strong>
                  <router-link
                  :to="{name: 'organizationShow', params: {organization: org.name}}"
                  >
                    {{org.displayName || org.name}}
                  </router-link>
                </strong>
                <p>{{org.description}}</p>
              </div>

              <article v-for="proj in projects.filter(p => p.organizationId === org.id)" class="media">
                <!-- This empty picture pulls the nested content right -->
                <figure class="media-left"><p class="image is-48x48"></p></figure>

                <div class="media-content">
                  <div class="icon is-small">
                    <i class="fa fa-list-alt" />&nbsp;
                  </div>
                  <strong>{{proj.displayName}}</strong>
                  <p>{{proj.description}}</p>
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
  import {mapGetters} from 'vuex'
  import R from 'ramda'
  import gravatar from 'gravatar'
  import {Users, Organizations} from 'app/api'
  import {HeroTitle} from 'app/components'

  export default {
    name: 'UserShowView',

    components: {HeroTitle},

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

    methods: {
      gravatar(email) {
        return gravatar.url(email, {size: 512})
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
</script>
