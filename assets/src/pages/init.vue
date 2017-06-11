<template>
  <q-layout>
  <div class="toolbar white" slot="header">
    <button
      class="hide-on-drawer-visible"
      @click="drawer.open = true"
    >
      <i>menu</i>
    </button>
    <q-toolbar-title :padding="2">
      <b v-link="'/'" class="PP">PP</b>
    </q-toolbar-title>
  </div>
  <div class="layout-view">
  </div>
</q-layout>

</template>

<script>
export default {
  name: 'Init',
  data () {
    return {
      drawer: {
        open: false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.layout-view
  background-image: url("http://www.planwallpaper.com/static/images/6993917-light-circles-abstract-wallpapers.jpg");
.rigth-header
  float: rigth
.PP
  background-color: #88c139;
  border-radius: 100%
  padding: 10px
  color: white !important
.search
  background-color: #e3e7ea;
</style>
