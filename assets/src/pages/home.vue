<template>
  <q-layout class="bg-light-blue-1">
    <div slot="header" class="toolbar bg-light-blue-5">
      <div class="toolbar-content">
        <div class="toolbar-title" :padding="1">
          Spider Poker
        </div>
      </div>
      <button v-link="'/auth/login'">Sign in</button>
      <button v-link="'/auth/register'">Sign up</button>
    </div>

    <div class="layout-view">
      <div class="logo">
        <img src="../assets/SpiderPoker.png" height="300" width="300">
        <h1><b>Spider</b>Poker</h1>
        <h2>Built to improve your complexity analysis.</h2>

        <br/>

        <button class="primary" v-link="'/auth/register'">
          <i>whatshot</i>
          I wanna start!
        </button>
        <a href="https://github.com/projeto-spider/planning-poker" target="_blank">
          <button class="primary" >
            <i>cloud</i>
            know more
          </button>
        </a>
        <a href="http://www.spider.ufpa.br/" target="_blank">
          <button class="primary">
            <i>account_circle</i>
            Spider project
          </button>
        </a>
      </div>
    </div>
    </q-layout>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {}
  }
}
</script>

<style lang="sass" scoped>
.logo
  margin: 5% auto
  text-align: center

  h1
    font-size: 50px
    color: #3c5675

  h2
    font-size: 30px
    color: #3c5675
</style>
