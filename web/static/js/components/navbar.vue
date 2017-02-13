<template>
  <section class="hero is-primary is-medium">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <router-link :to="{name: 'home'}" class="nav-item">
            <b>Planning</b>Poker
          </router-link>
        </div>

        <span class="nav-toggle" @click='toggleNav'>
          <span></span>
          <span></span>
          <span></span>
        </span>

        <div class="nav-right nav-menu" :class="{'is-active': navOpen}">
          <router-link :to='{name: "home"}' class="nav-item">
            Home
          </router-link>

          <router-link :to='{name: "organizationsList"}' class="nav-item">
            Organizations
          </router-link>

          <span v-if="!loggedin" class="nav-item">
            <router-link
              :to="{name: 'login'}"
              class="button is-info is-inverted is-outlined"
            >
              <span class="icon is-small">
                <i class="fa fa-sign-in"></i>
              </span>
              <span>Sign In</span>
            </router-link>
          </span>

          <span v-if="!loggedin" class="nav-item">
            <router-link
              :to="{name: 'register'}"
              class="button is-info is-inverted is-outlined"
            >
              <span class="icon is-small">
                <i class="fa fa-group"></i>
              </span>
              <span>Sign up</span>
            </router-link>
          </span>

          <span v-if="loggedin" class="nav-item">
            <router-link
              :to="{name: 'userShow', params: {username}}"
              class="button is-success"
            >
              <span class="icon is-small">
                <i class="fa fa-user"></i>
              </span>
              <span>Profile</span>
            </router-link>
          </span>

          <span v-if="loggedin" class="nav-item">
            <router-link
              :to="{name: 'logout'}"
              class="button is-danger"
            >
              <span class="icon is-small">
                <i class="fa fa-sign-out"></i>
              </span>
              <span>Logout</span>
            </router-link>
          </span>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  import R from 'ramda'
  import {mapState} from 'vuex'

  export default {
    name: 'Navbar',

    data() {
      return {
        navOpen: false
      }
    },

    computed: {
      ...mapState({
        loggedin: R.pipe(
          R.view(R.lensPath(['auth', 'user'])),
          R.isNil,
          R.not
        ),
        username: R.view(R.lensPath(['auth', 'user', 'username']))
      })
    },

    methods: {
      toggleNav() {
        this.navOpen = !this.navOpen
      }
    }
  }
</script>

<style lang="sass" scoped>
nav
  padding: 0 73px
</style>
