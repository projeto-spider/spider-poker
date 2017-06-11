<template>
  <div>
    <q-layout>
      <div class="layout-view">
        <div class="columns">
          <div class="column is-half">
            <div class="title-box">
              <h1 class="title">
                <b>Planning</b>Poker
              </h1>
              <p class="subtitle">Built to improve your complexity analysis</p>
            </div>
          </div>
          <div class="column">
            <div class="layout-padding">
              <div class="box">
                <div class="floating-label">
                  <input required class="full-width">
                  <label>User name</label>
                </div>
                <div class="floating-label">
                  <input required class="full-width">
                  <label>Email</label>
                </div>
                <div class="floating-label">
                  <input required class="full-width">
                  <label>Password</label>
                </div>
                <div class="floating-label">
                  <input required class="full-width">
                  <label>Confirm password</label>
                </div>
                <br/>
                <button class="button is-primary is-fullwidth"> Sing up </button>
              </div>
          </div>
        </div>
      </div>
    </div>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {}
  }
}
</script>

<style lang="sass" scoped>
.layout-view
  dispay: flex
  flex-direction: column
.box
  margin: 20% auto
.title-box
  color: black
  width: 340px;
  margin: 40% 30%;
.title
  font-size: 50px
  color: #88c139
.subtitle
  color: white
</style>
