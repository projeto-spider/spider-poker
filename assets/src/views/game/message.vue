<template>
  <article class="media media-message" :class="{'is-from-self': fromSelf}">
    <figure class="media-left">
      <p class="image is-48x48">
        <img :src="gravatar(user.email)">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{user.display_name}}</strong>
          <small>@{{user.username}}</small>
          <br>
          {{body}}
        </p>
      </div>
    </div>
  </article>
</template>

<script>
import gravatar from 'gravatar'

export default {
  name: 'Message',

  props: ['user', 'body', 'fromSelf'],

  methods: {
    gravatar(email) {
      return gravatar.url(email, {size: 512})
    }
  }
}
</script>

<style lang="sass" scoped>
.media-message
  margin-top: 0
  margin-bottom: 5px

  &.media + .media
    border-top: 0

  .media-left img
    border-radius: 50%

  .media-content
    background-color: #00B1FF
    padding: 3px 10px
    border-radius: 5px

    .content, strong
      color: #fff

  &.is-from-self
    flex-direction: row-reverse

    .media-left
      margin-right: 0

    .media-content
      margin-right: 10px
      background-color: #EAEFF3

      .content, strong
        color: #000
</style>
