<template>
  <story
    :story="story"
    :isChild="isChild"
  >
    <div slot="rigth-button">
      <div v-if="!isChild">
        <template v-if="role === 'manager' && !voting && !discussion && story.children.length === 0">
          <button
            v-if="role === 'manager' && currentStory != story.id"
            @click="selectStory()"
            class="clear pull-right story-button select-button"
          >
            <i>star_border</i>
          </button>

          <button v-else disabled class="clear pull-right select-button">
            <i>star</i>
          </button>
        </template>
      </div>

      <div v-else>
        <template v-if="role === 'manager' && !voting && !discussion">
          <button
            v-if="role === 'manager' && currentStory != story.id"
            @click="selectStory(story)"
            class="clear pull-right story-button select-button"
          >
            <i>star_border</i>
          </button>

          <button v-else disabled class="clear pull-right select-button">
            <i>star</i>
          </button>
        </template>
      </div>
    </div>
  </story>
</template>

<script src="./game-story.js"></script>

<style lang="sass" src="./game-story.sass"></style>
