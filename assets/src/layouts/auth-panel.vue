<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">
          <router-link :to="{name: 'home'}">
            <b>Planning</b>Poker
          </router-link>
        </h1>

        <div class="row">
          <div class="column is-half is-offset-one-quarter">
            <div class="box">
              <router-view/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'AuthPanelLayout'
  }
</script>

<style lang="sass">
.box
  color: black
</style>
