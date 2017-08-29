<template>
  <div class="message-input">
    <q-search
      v-model="message"
      :debounce="0"
      placeholder="Type your messages"
      icon="send"
      class="primary"
      @enter="onEnterKey()"
    ></q-search>
  </div>
</template>

<style lang="sass" src="./message-input.sass"></style>
<script src="./message-input.js"></script>
