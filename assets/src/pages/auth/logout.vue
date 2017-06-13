<template>
  <div class="auth-page window-height window-width bg-light column items-center">
    <div class="auth-title bg-primary flex items-center justify-center">
      Logout
    </div>
    <div>
      <div class="auth-card card bg-white">
        <p>Wait a minute.</p>
        <p>Redirecting you.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit('set_token', '')
    this.$store.commit('set_user', null)
    this.$router.push({name: 'Login'})
  }
}
</script>
