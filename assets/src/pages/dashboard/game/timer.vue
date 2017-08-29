<template>
  <div v-if="game && timer" class="toolbar">
    <q-toolbar-title style="text-align: center">
      {{twoDigits(timer.minutes)}}:{{twoDigits(timer.seconds)}}
    </q-toolbar-title>
  </div>
</template>

<script src="./timer.js"></script>
