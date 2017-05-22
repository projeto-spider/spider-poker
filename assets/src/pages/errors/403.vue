<template>
  <div class="error">
    <div class="row">
      <div class="columns">
        <div class="column is-half">
          <div class="title-box">
            <h1 class="title">
              <router-link :to="{name: 'home'}">
                <b>Planning</b>Poker
              </router-link>
            </h1>
          </div>
        </div>
        <div class="column is-half">
          <div class="text-box has-text-centered">
            <div class="notification is-warning">
              <h1>403</h1>
            </div>
            <h1>Not authorized</h1>
            <p>It would appear that you can not acess <em>{{ path }}</em>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    path: {
      type: String,
      required: false
    }
  },
  created() {
    // Get the current route.
    let route = this.$route;
    // Set the route path in the data.
    this.path = route.path;
  }
}
</script>

<style lang="sass" src="./403.sass"></style>
