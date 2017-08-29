<template>
  <q-layout>
    <div class="layout-view">
      <div v-if="!authenticated" class="layout-padding align-center">
        <button class="primary" @click="askLoginInformations">
          Start with basic authentication
        </button>
        <button class="primary" @click="askApiInformations">
          Start with API key (recommended)
        </button>
      </div>

      <div v-else class="layout-padding">
        <div v-if="issuesMenu">
          <div v-for="issue in issuesList">
            <div v-bind:key="issue"  class="card card-story bg-lime-2">
              <div class="card-title">
                <input
                  type="checkbox"
                  v-model="selected.stories"
                  id="issue.id"
                  :value="issue"
                >
                  <label>{{issue.subject}}</label>

                  <br/>
                  <label class="text-grey-9">{{issue.description}}</label>
              </div>
            </div>
          </div>
          <button v-if="issuesList.length >= 25" class="primary" @click="loadMoreIssues">Load more Issues</button>
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
          <button @click="goBack">Back</button>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script src="./from-redmine.js"></script>
