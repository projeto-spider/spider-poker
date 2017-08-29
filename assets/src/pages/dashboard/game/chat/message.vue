<template>
  <div
    class="chat-message"
    :class="{[message.user_id === loggedUser.id ? 'chat-you' : 'chat-other']: true}"
  >
    <div v-if="anonymous" class="chat-date">Anonymous</div>

    <div class="chat-user">
      <avatar v-if="user" :user="user"></avatar>
    </div>

    <div class="chat-message">
      <p>{{message.body}}</p>
    </div>
  </div>
</template>

<script src="./message.js"></script>

<style lang="sass" src="./message.sass"></style>
