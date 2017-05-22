<template>
  <div class="app-container">
    <app-aside></app-aside>
    <div class="app-content" :class="{'fullheight-page': fullheightPage}">
      <navbar></navbar>
      <router-view/>
      <footer-component v-if="!hideFooter"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {
  AppAside, Navbar, Footer
} from 'app/components'

export default {
  name: 'BaseLayout',

  components: {AppAside, Navbar, 'footer-component': Footer},

  computed: mapGetters(['fullheightPage', 'hideFooter'])
}
</script>

<style lang="sass" src="./base.sass"></style>
