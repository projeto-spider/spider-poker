<template>
  <q-layout>
   <div slot="header" class="toolbar bg-white">
      <q-select
        label="Select a Project"
        class="full-width text-dark"
        type="list"
        v-model="projectIndexOnList"
        :options="selectOptions"
        @input="loadBacklog"
      ></q-select>
    </div>

    <div v-if="selectedProject" class="layout-view">
      <div v-if="backlog.length" class="layout-padding">
        <div v-for="(story, i) in backlog">
          <div :key="story" class="card card-story bg-lime-2">
            <div class="card-title">
              <input
                type="checkbox"
                v-model="selected.stories"
                id="story.id"
                :value="story"
              >
                <label>{{story.title}}</label>
                <div>
                <label class="text-grey-9">{{story.description}}</label>
                </div>
            </div>
          </div>

          <div v-for="child in story.children" class="card card-story bg-lime-4 child-story">
            <div class="card-title">
            {{child.title}}
            </div>
          </div>
        </div>
        <button 
          @click="doImport" 
          :class="{'primary': selectedStories, 'disabled': !selectedStories}"
        >
          Import
        </button>
        <button @click="selectAll" class="primary">Select all</button>
        <button
          :class="{'primary': selectedStories, 'disabled': !selectedStories}"
          @click="deselectAll"
        >
          Deselect all
        </button>
      </div>
      <div v-else class="layout-padding">
        <b>This Project do not have stories yet.</b>
      </div>
    </div>
  </q-layout>
</template>

<script src="./from-project.js"></script>

<style lang="sass" src="./from-project.sass"></style>
