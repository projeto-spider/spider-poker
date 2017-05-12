<template>
  <div>
    <div v-if="isAuthenticated" class="user-panel">
      <div class="pull-left image"><img :src="avatar" alt="User image" class="img-circle"/></div>
      <div class="pull-left info">
        <p>{{user.username}}</p>
        <router-link :to="{name: 'logout'}">Logout</router-link>
      </div>
    </div>
    <div v-if="!isAuthenticated" class="user-panel">
      <router-link
        :to="{name: 'register'}"
        class="btn btn-block btn-primary"
      >
        Register
      </router-link>
      <router-link :to="{name: 'login'}" class="btn btn-block btn-default">Login</router-link>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex';
  import R from 'ramda'
  import {gravatarUrl} from 'app/utils';

  const userView = R.view(R.lensPath(['auth', 'user']));

  export default {
    name: 'SidebarUserPanel',

    computed: {
      ...mapGetters(['isAuthenticated']),

      ...mapState({
        user: userView,

        avatar: R.pipe(
          userView,
          R.prop('email'),
          gravatarUrl
        )
      }),
    }
  }
</script>
