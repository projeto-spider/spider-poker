<template>
  <section class="hero" :class='this.colorClass'>
    <div class="hero-body">
      <div class="container is-fluid">
        <h1 class="title">
          {{text}}
        </h1>

        <h2 v-if="subtitle" class="subtitle">
          {{subtitle}}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'HeroTitle',

    props: ['text', 'subtitle', 'color'],

    computed: {
      colorClass() {
        if (!this.color) {
          return {'is-primary': true}
        }

        return {[`is-${this.color}`]: true}
      }
    }
  }
</script>

<style lang="sass" scoped>
.container
  margin: 0 73px
</style>
