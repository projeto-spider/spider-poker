<template>
  <div :class="{'card card-story bg-lime-4 child-story': isChild, 'card card-story bg-lime-2': !isChild}">
    <div class="card-title">
      <span v-if="estimation" class="label bg-primary text-white">
        {{estimation}}
      </span>

      {{story.title}}

      <slot name="rigth-button"></slot>
    </div>

    <div v-if="story.description" class="card-content">
      {{story.description}}
    </div>
  </div>
</template>

<script src="./story.js"></script>

<style lang="sass" src="./story.sass"></style>
