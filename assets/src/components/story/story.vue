<template>
  <div :class="{'card card-story bg-lime-4 child-story': isChild, 'card card-story bg-lime-2': !isChild}">
    <div class="card-title">
      <template v-if="!isChild">
        <span v-if="story.estimation" class="label bg-primary text-white">
          <template v-if="story.estimation === 'time'"><i>access_time</i></template>
          <template v-else>{{estimation}}</template>
        </span>

        <span v-if="story.children.length" class="label bg-primary text-white">
          {{estimation}}
        </span>
      </template>


      <span v-if="isChild && estimation" class="label bg-primary text-white">
        <template v-if="estimation === 'time'"><i>access_time</i></template>
        <template v-else>{{story.estimation}}</template>
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
