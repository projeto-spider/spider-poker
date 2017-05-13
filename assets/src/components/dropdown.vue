<template>
  <my-vue-dropdown
    :visible="open"
    @clickOut="handleClickOut"
    :position="position"
    :animation="animation"
  >
    <div @click="handleClick">
      <slot></slot>
    </div>

    <div slot="dropdown" class="dropdown">
      <slot name="dropdown-menu"></slot>
    </div>
  </my-vue-dropdown>
</template>

<script src="./dropdown.js"></script>
<style lang="sass" src="./dropdown.sass"></style>
