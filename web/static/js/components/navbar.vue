<template>
  <section class="hero is-primary is-medium">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <router-link :to="{name: 'home'}" class="nav-item">
            <b>Planning</b>Poker
          </router-link>
        </div>

        <div class="nav-center">
          <a class="nav-item" href="https://github.com/lubien/vue-brunch-boilerplate" target="_blank">
            <span class="icon">
              <i class="fa fa-github"></i>
            </span>
          </a>
          <a class="nav-item" href="https://twitter.com/@joao_lubien" target="_blank">
            <span class="icon">
              <i class="fa fa-twitter"></i>
            </span>
          </a>
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
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Navbar',

    data() {
      return {
        navOpen: false
      }
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

  .nav-left
    padding-left: 0

  .nav-right a:last-child
    padding-right: 0
</style>
