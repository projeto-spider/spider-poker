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
          <div v-bind:key="story">
            <project-story
              :story="story"
              :isChild="false"
              :promptNewPosition="() => promptNewPosition(story, position)"
              :promptStoryUpdate="() => promptStoryUpdate(story)"
              :confirmStoryDeletion="() => confirmStoryDeletion(story)"
              ></project-story>
          </div>

          <project-story
            :story="child"
            :isChild="true"
            :promptNewPosition="() => promptNewPosition(child, child_position, story)"
            :promptStoryUpdate="() => promptStoryUpdate(child)"
            :confirmStoryDeletion="() => confirmStoryDeletion(child)"
            v-for="(child, child_position) in story.children"
            v-if="child"
            :key="child"
          >
          </project-story>
        </template>
      </transition-group>
    </template>
  </div>
</template>

<script src="./project.js"></script>
<style lang="sass" src="./project.sass"></style>
