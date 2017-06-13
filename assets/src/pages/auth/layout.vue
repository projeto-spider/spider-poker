<template>
  <div class="auth-page window-height window-width bg-light column items-center">
    <div class="auth-title bg-primary flex items-center justify-center">
      <slot name="title"></slot>
    </div>

    <div>
      <div class="auth-card card bg-white">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style lang="stylus">
.auth-page
  .auth-title
    height 30vh
    width 100%
    font-size 10vmax
    color rgba(255, 255, 255, .2)
    overflow hidden
  .auth-card
    margin-top -25px
    width 90vw
    max-width 600px
    padding 50px
    i
      font-size 5rem
</style>
