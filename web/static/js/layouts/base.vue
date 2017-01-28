<template>
  <div>
    <navbar/>
    <router-view/>
    <footer-component/>
  </div>
</template>

<script>
  import {
    Navbar,
    Footer
  } from 'app/components'

  export default {
    name: 'BaseLayout',

    components: {Navbar, 'footer-component': Footer}
  }
</script>
