<template>
  <div class="layout-padding align-center">
    <template v-if="!project">
      Select a project to start
    </template>

    <template v-else-if="!socket">
      Not connected to server
    </template>

    <template v-else>
      <ul class="breadcrumb">
        <li><a>Dashboard</a></li>
        <li><a>{{organization.display_name || organization.name}}</a></li>
        <li><a>{{project.display_name || project.name}}</a></li>
      </ul>

      <div style="clear: both"></div>

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
        <template v-for="(story, position) in backlog">
          <div v-bind:key="story" class="card card-story bg-lime-2">
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

          <div v-for="(child, child_position) in story.children" v-if="child" :key="`id-${child.id}`" class="card card-story bg-lime-4" style="left: 15px">
            <div class="card-title">

              <button ref="target" class="clear pull-right story-button">
                <i>more_vert</i>

                <q-popover ref="popover">
                  <div class="list item-delimiter highlight">
                    <div
                      class="item item-link"
                      @click="promptNewPosition(child, child_position, story), $refs.popover[child_position].close()"
                    >
                      <div class="item-content">Move</div>
                    </div>

                    <div
                      class="item item-link"
                      @click="promptStoryUpdate(child), $refs.popover[child_position].close()"
                    >
                      <div class="item-content">Edit</div>
                    </div>

                    <div
                      class="item item-link"
                      @click="confirmStoryDeletion(child), $refs.popover[child_position].close()"
                    >
                      <div class="item-content">Delete</div>
                    </div>
                  </div>
                </q-popover>
              </button>

              <span v-if="child.estimation" class="label bg-primary text-white">
                <template v-if="child.estimation === 'time'"><i>access_time</i></template>
                <template v-else>{{child.estimation}}</template>
              </span>

              {{child.title}}
            </div>

            <div v-if="child.description" class="card-content">
              {{child.description}}
            </div>
          </div>
        </template>
      </transition-group>
    </template>
  </div>
</template>

<script src="./project.js"></script>
<style lang="sass" src="./project.sass"></style>
