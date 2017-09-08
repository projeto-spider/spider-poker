<template>
  <div :class="{'card card-story bg-lime-4 child-story': isChild, 'card card-story bg-lime-2': !isChild}">
    <div class="card-title">
      <slot name="rigth-button"></slot>

      <span v-if="estimation" class="label bg-primary text-white">
        {{estimation}}
      </span>

      <template>
        <img v-if="story.source === 1" src="~assets/logo-redmine-mini.jpg" class="story-source-image">
        <img v-else-if="story.source === 2" src="~assets/logo-trello-mini.png" class="story-source-image">
      </template>

      {{story.title}}
    </div>

    <div v-if="story.description" class="card-content">
      {{story.description}}
    </div>
  </div>
</template>

<script src="./story.js"></script>

<style lang="sass" src="./story.sass"></style>
