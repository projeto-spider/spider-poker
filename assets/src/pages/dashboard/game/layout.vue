<template>
  <div class="layout-padding align-center">
    <transition-group v-if="story" name="card-story" tag="div">
      <project-story
        :story="story"
        :key="story.id"
        :isChild="false"
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
      ></project-story>
    </transition-group>

    <div v-for="message in chat" :key="message">
      <message :message="message"></message>
    </div>

    <message-input
      :sendMessage="sendMessage"
    ></message-input>
  </div>
</template>

<style lang="sass" src="./layout.sass"></style>
<script src="./layout.js"></script>
