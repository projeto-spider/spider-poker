<template lang="pug">
  .login-box
    .login-logo
      router-link(':to'="{name: 'home'}") #[b Planning]Poker
    .login-box-body
      router-view.nested-child
</template>

<script>
  export default {
    name: 'AuthPanel'
  }
</script>
