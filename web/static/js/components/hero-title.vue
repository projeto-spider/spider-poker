<template>
  <section class="hero is-primary">
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

    props: ['text', 'subtitle']
  }
</script>

<style lang="sass" scoped>
.container
  margin: 0 73px
</style>
