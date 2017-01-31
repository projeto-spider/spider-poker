<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style lang="sass">
@import '~font-awesome/css/font-awesome.css'
@import '~bulma'
@import '~nprogress/nprogress.css'

main > .container
  padding: 10px 0

#nprogress .bar
  background-color: #3273DC

#nprogress .spinner
  display: none
</style>
