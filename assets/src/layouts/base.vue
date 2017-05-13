<template>
  <div class="app-container">
    <app-aside></app-aside>
    <div class="app-content">
      <navbar></navbar>
      <router-view/>
      <footer-component/>
    </div>
  </div>
</template>

<script>
import {
  AppAside, Navbar, Footer
} from 'app/components'

export default {
  name: 'BaseLayout',

  components: {AppAside, Navbar, 'footer-component': Footer}
}
</script>

<style lang="sass" src="./base.sass"></style>
