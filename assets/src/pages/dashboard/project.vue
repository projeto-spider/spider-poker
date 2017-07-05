<template>
  <div class="layout-padding align-center">
    <template v-if="!project">
      Select a project to start
    </template>

    <template v-else-if="!socket">
      Not connected to server
    </template>

    <template v-else>
      <div class="story-form" @keydown.enter="unshiftStory">
        <div class="list">
          <div class="item three-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input v-model="title" required class="full-width">
                <label>New Story Title</label>
              </div>
            </div>
          </div>

          <q-transition name="slide">
            <div v-show="title.length > 3">

              <div class="item three-lines">
                <div class="item-content">
                  <div class="stacked-label">
                    <input v-model="description" class="full-width">
                    <label>Description (optional)</label>
                  </div>
                </div>
              </div>
            </div>
          </q-transition>
        </div>
      </div>

      <transition-group name="card-story" tag="div">
        <div v-for="(story, position) in backlog" v-bind:key="story" class="card card-story bg-lime-2">
          <div class="card-title">

            <button ref="target" class="clear pull-right story-button">
              <i>more_vert</i>

              <q-popover ref="popover">
                <div class="list item-delimiter highlight">
                  <div
                    class="item item-link"
                    @click="promptNewPosition(story, position), $refs.popover[position].close()"
                  >
                    <div class="item-content">Move</div>
                  </div>

                  <div
                    class="item item-link"
                    @click="promptStoryUpdate(story), $refs.popover[position].close()"
                  >
                    <div class="item-content">Edit</div>
                  </div>

                  <div
                    class="item item-link"
                    @click="confirmStoryDeletion(story), $refs.popover[position].close()"
                  >
                    <div class="item-content">Delete</div>
                  </div>
                </div>
              </q-popover>
            </button>

            <span v-if="story.estimation" class="label bg-primary text-white">
              <template v-if="story.estimation === 'time'"><i>access_time</i></template>
              <template v-else>{{story.estimation}}</template>
            </span>

            {{story.title}}
          </div>

          <div v-if="story.description" class="card-content">
            {{story.description}}
          </div>
        </div>
      </transition-group>
    </template>
  </div>
</template>

<script src="./project.js"></script>
<style lang="sass" src="./project.sass"></style>
