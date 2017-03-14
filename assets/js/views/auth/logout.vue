<template>
  <div>
    <div class="callout callout-success">
      <h4>Logout</h4>
      <p>Redirecting you to the homepage</p>
    </div>
  </div>
</template>

<script>
  import store from 'app/store'

  export default {
    name: 'LogoutView',

    created() {
      store.commit('auth/set_token', '')
      store.commit('auth/set_user', null)
      this.$router.push({name: 'home'})
    }
  }
</script>
