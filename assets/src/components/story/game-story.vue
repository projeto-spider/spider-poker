<template>
  <div>
   <div class="card-title">
      <div v-if="!isChild">
        <template v-if="role === 'manager' && !voting && !discussion && story.children.length === 0">
          <button
            v-if="role === 'manager' && currentStory != story.id"
            @click="selectStory()"
            class="clear pull-right story-button"
            style="margin-bottom: -16px;"
          >
            <i>star_border</i>
          </button>

          <button v-else disabled class="clear pull-right" style="margin-top: -7px">
            <i>star</i>
          </button>
        </template>
      </div>

      <div v-else>
        <template v-if="role === 'manager' && !voting && !discussion">
          <button
            v-if="role === 'manager' && currentStory != story.id"
            @click="selectStory(story)"
            class="clear pull-right story-button"
            style="margin-bottom: -16px;"
          >
            <i>star_border</i>
          </button>

          <button v-else disabled class="clear pull-right" style="margin-top: -7px">
            <i>star</i>
          </button>
        </template>
      </div>

      <template v-if="!isChild">
        <span v-if="!story.children.length && story.estimation" class="label bg-primary text-white">
          <template v-if="story.estimation === 'time'"><i>access_time</i></template>
          <template v-else>{{story.estimation}}</template>
        </span>

        <span v-if="story.children.length" class="label bg-primary text-white">
          {{
              story.children
                .map(child => child.estimation || 0)
                .reduce((x, y) => x + y)
          }}
        </span>
      </template>

      <span v-if="isChild && story.estimation" class="label bg-primary text-white">
        <template v-if="story.estimation === 'time'"><i>access_time</i></template>
        <template v-else>{{story.estimation}}</template>
      </span>

      {{story.title}}
    </div>

    <div v-if="story.description" class="card-content">
      {{story.description}}
    </div>
  </div>
</template>

<script src="./game-story.js"></script>
