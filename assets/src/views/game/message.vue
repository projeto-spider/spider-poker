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

<style lang="sass" src="./message.sass" scoped></style>
