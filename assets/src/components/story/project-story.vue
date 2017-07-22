<template>
  <div>
    <div class="card-title">
      
      <button ref="target" class="clear pull-right story-button">
        <i>more_vert</i>

        <q-popover ref="popover">
          <div class="list item-delimiter highlight">
            <div
              class="item item-link"
              @click="promptNewPosition(), $refs.popover.close()"
            >
              <div class="item-content">Move</div>
            </div>

            <div
              class="item item-link"
              @click="promptStoryUpdate(), $refs.popover.close()"
            >
              <div class="item-content">Edit</div>
            </div>

            <div
              class="item item-link"
              @click="confirmStoryDeletion(), $refs.popover.close()"
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
</template>

<script src="./project-story.js"></script>
