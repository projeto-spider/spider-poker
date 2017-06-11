<template>
  <div>
    <div class="layout-padding">
      <div class="auth-form has-text-centered">
      <b class="PP">PP</b>
      <h1 class="title">
        <b>Planning</b>Poker
      </h1>
      <div class="row">
        <div class="box">
          <div class="floating-label">
            <input required class="full-width">
            <label>User name</label>
          </div>
          <div class="floating-label">
            <input required class="full-width">
            <label>Password</label>
          </div>
          <br/>
            <button class="button is-primary is-fullwidth"> Sing in </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="sass" scoped>
.PP
  font-size: 50px
  background-color: #88c139;
  border-radius: 80%
  color: white !important
  padding: 5px
.title
  font-size: 50px
  color: #88c139
.auth-form
  margin: 0 auto
  width: 340px;
</style>
