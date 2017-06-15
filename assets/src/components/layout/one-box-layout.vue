<template>
  <div class="box-page window-height window-width bg-light column items-center">
    <div class="box-title bg-primary flex items-center justify-center">
      <slot name="title"></slot>
    </div>

    <div>
      <div class="box-card card bg-white">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script src="./one-box-layout.js"></script>
<style lang="sass" src="./one-box-layout.sass"></style>
