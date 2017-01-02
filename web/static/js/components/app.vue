<template>
  <div class="app">
      <h1>Hello World!</h1>
      <p v-if="token">You are authenticated with the following token <strong>{{ token }}</strong></p>
      <router-link :to="{name: 'login'}">login</router-link>
      <router-link :to="{name: 'logout'}">logout</router-link>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Auth from 'app/api/auth';
  export default {
    name: 'App',

    computed: mapState({
      token: state => state.auth.token
    }),
  }
</script>
