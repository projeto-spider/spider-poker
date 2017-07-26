<template>
  <story
    :story="story"
    :isChild="isChild"
  >
    <span slot="rigth-button">
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
    </span>
  </story>
</template>

<script src="./project-story.js"></script>
