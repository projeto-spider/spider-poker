<template>
  <div class="is-fullheight">
    <navbar/>
    <router-view/>
  </div>
</template>

<script>
import {Navbar} from 'app/components'

export default {
  name: 'GameLayout',
  components: {Navbar}
}
</script>

<style lang="sass">
html, body
	margin: 0
	height: 100%

.is-fullheight
  height: 100%
  overflow: hidden
</style>
