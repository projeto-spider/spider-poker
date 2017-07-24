<template>
  <q-search
    v-model="message"
    :debounce="0"
    placeholder="Type your messages"
    icon="send"
    class="primary"
    @enter="onEnterKey()"
  ></q-search>
</template>

<script src="./message-input.js"></script>
