<template>
  <div>
    <q-layout>
    <div class="layout-padding">
      <div class="text-box has-text-centered is-fullheight">
        <header class="title">
         What is <a v-link="'/'" class="is-spider"><b>Planning</b>Poker? </a>
        </header>
          <p class="subtitle">
            <b>Is a easy Way to work in team. </b>
            <p class="text">
              Here you can discuss with your team and finish goals by chating, atualizing user's stories and playing in a clean and intuitive tool.
            </p>
          </p>

          <p class="litle-title">
            <b> Is a self hosted and confiable application </b>
            <p class="text">
              Here you can register  organizations, create projects, backlogs and work on it
            </p>
          </p>
        </div>
      </div>
      </q-layout>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {}
  }
}
</script>

<style lang="sass" scoped>
.text-box
  overflow-y: auto
.title
  font-size: 50px
  text-align: center
  padding: 30px 0px 50px 0px
  color: white
.subtitle
  font-size: 40px
  color: white
.is-spider
  color: #88c139
.text
  margin-left: auto
  margin-right: auto
  padding-bottom: 100px;
  font-size: 20px;
  width: 66.66667%;
  font-weight: 300;
  color: white
.litle-title
  font-size: 25px
  color: white
.is-centered
  text-align: center
.is-left
  text-align: left !important
</style>
