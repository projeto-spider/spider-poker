<template>
  <div class="wrapper">
    <transition name="fade">
      <div v-show="loading" class="load-mask">
        <i class="fa fa-refresh"></i>
      </div>
    </transition>
    <slot></slot>
  </div>
</template>

<script src="./loading-block.js"></script>
<style lang="sass" src="./loading-block.sass" scoped></style>
