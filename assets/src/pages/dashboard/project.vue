<template>
  <div class="layout-padding align-center">
    <div class="story-form">
      <div class="list">
        <div class="item two-lines">
          <div class="item-content">
            <div class="stacked-label">
              <input v-model="title" required class="full-width">
              <label>New Story Title</label>
            </div>
          </div>
        </div>

        <hr/>

        <div class="item two-lines">
          <div class="item-content">
            <div class="stacked-label">
              <input v-model="description" class="full-width">
              <label>Description (optional)</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="story in backlog" class="card card-story bg-lime-2">
      <div class="card-title">
        {{story.title}}

        <button ref="target" class="clear pull-right">
          <i>more_vert</i>

          <q-popover ref="popover">
            <div class="list item-delimiter highlight">
              <div
                class="item item-link"
                @click="doSomething(), $refs.popover.close()"
              >
                ...
              </div>
            </div>
          </q-popover>
        </button>
      </div>

      <div v-if="story.description" class="card-content">
        {{story.description}}
      </div>
    </div>
  </div>
</template>

<script src="./project.js"></script>
<style lang="sass" src="./project.sass"></style>
