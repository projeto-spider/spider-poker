<template>
  <div class="layout-padding align-center">
    <template v-if="!project">
      Select a project to start
    </template>

    <template v-else-if="!socketConnected">
      Not connected to server
    </template>

    <template v-else>
      <div v-if="!hasPo" class="card">
        <div class="card-title bg-warning text-white">
          Missing Product Owner
        </div>

        <div class="card-content card-force-top-padding">
          Before you can play the game your project need a Product Owner.
          Select one on the sidebar.
        </div>
      </div>

      <h5>
        {{project.name}}
        <small v-if="project.organization" class="text-faded pull-right">{{project.organization}}</small>
      </h5>

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
          <project-story
            :story="story"
            :key="story.id"
            :isChild="false"
            :promptNewPosition="() => promptNewPosition(story, position)"
            :promptStoryUpdate="() => promptStoryUpdate(story)"
            :confirmStoryDeletion="() => confirmStoryDeletion(story)"
            :startGame="() => startGame(story)"
            ></project-story>

          <project-story
            v-for="(child, child_position) in story.children"
            v-if="child"
            :key="child.id"
            :story="child"
            :isChild="true"
            :promptNewPosition="() => promptNewPosition(child, child_position, story)"
            :promptStoryUpdate="() => promptStoryUpdate(child)"
            :confirmStoryDeletion="() => confirmStoryDeletion(child, story)"
            :startGame="() => startGame(child)"
          ></project-story>
        </template>
      </transition-group>
    </template>
  </div>
</template>

<script src="./stories.js"></script>
<style lang="sass" src="./stories.sass"></style>
