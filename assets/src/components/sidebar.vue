<template>
  <div
    class="modal sidebar"
    :class="containerClassesObj"
  >
  <div @click="clickAway" class="modal-background is-clickable"></div>
    <div
      @click.prevent=""
      class="modal-content"
      :class="{'is-fullheight': fullHeight}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script src="./sidebar.js"></script>
<style lang="sass" src="./sidebar.sass" scoped></style>
