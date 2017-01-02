<template lang="pug">
  div
    .user-panel(v-if='loggedin')
      .pull-left.image
        img.img-circle(':src'='avatar', alt='User image')
      .pull-left.info
        p {{user.username}}
        router-link(':to'="{name: 'logout'}") Logout

    .user-panel(v-if='!loggedin')
      router-link.btn.btn-block.btn-primary(':to'='{name: "register"}') Register
      router-link.btn.btn-block.btn-default(':to'='{name: "login"}') Login
</template>

<script>
  import {mapState} from 'vuex';
  import {R, gravatarUrl} from 'app/utils';

  const userView = R.view(R.lensPath(['auth', 'user']));

  export default {
    name: 'SidebarUserPanel',

    computed: {
      ...mapState({
        user: userView,

        loggedin: R.pipe(
          userView,
          R.isNil,
          R.not
        ),

        avatar: R.pipe(
          userView,
          R.prop('email'),
          gravatarUrl
        )
      }),
    }
  }
</script>
