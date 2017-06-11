<template>
  <q-layout>
    <div class="toolbar white" slot="header">
      <div class="left-header">
        <b v-link="'/'" class="PP">PP</b>
        <button> Features </button>
        <button v-link="'init'"> Explore </button>
        <button v-link="'/about'"> About </button>
      </div>
      <div class="rigth-header">
        <input class="search" placeholder="Search">
        <router-link :to="{name: 'Login'}"> Sing in </router-link>
          or
        <button> Sing up </button>
      </div>
    </div>
    <router-view class="layout-view"></router-view>
  </q-layout>
</template>

<script>
export default {
  name: 'Base',
  data () {
    return {}
  }
}
</script>

<style lang="sass" scoped>
.layout-view
  background-image: url("http://www.planwallpaper.com/static/images/6993917-light-circles-abstract-wallpapers.jpg");
.left-header
  float: left;
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
