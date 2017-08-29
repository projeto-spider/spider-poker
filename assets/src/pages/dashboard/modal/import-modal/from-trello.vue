<template>
  <q-layout>
    <div class="layout-view">
      <div v-if="!authorized" class="layout-padding">
        <button class="primary" @click="authorize">Log in on Trello</button>
      </div>

      <div v-else class="layout-padding">
        <div v-if="boardsMenu">
          <div v-for="board in boards">
            <div v-for="organization in organizations">
              <div v-if="board.idOrganization === organization.id">
                <div class="card card-story bg-lime-2">
                  <div class="card-title">
                    {{board.name}}
                  </div>

                  <div class="card-content">
                    <p>organization: {{organization.displayName}}</p>
                    <button
                      ref="target"
                      class="primary story-button"
                      @click="loadList(board)"
                    >
                      Choose this.
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="board.idOrganization === null">
              <div class="card card-story bg-lime-2">
                <div class="card-title">
                  {{board.name}}
                </div>
                <div class="card-content">
                  <button
                    ref="target"
                    class="primary story-button"
                    @click="loadList(board)"
                  >
                    Choose this.
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button @click="goBack" class="primary">Back</button>
        </div>

        <div v-if="backlogsMenu">
          <div v-if="loadedBacklog">
            <div v-for="backlog in backlogs">
              <div v-bind:key="backlog"  class="card card-story bg-lime-2">
                <div class="card-title">
                  {{backlog.name}}
                </div>
                <div class="card-content">
                  <button
                    ref="target"
                    class="primary story-button"
                    @click="loadCards(backlog)"
                  >
                    Choose this.
                  </button>
                </div>
              </div>
            </div>
            <button @click="goBack" class="primary">Back</button>
          </div>
          <div v-else>
            There's no backlog to be selected
          </div>
        </div>

        <div v-if="storiesMenu">
          <div v-if="loadedStories">
            <div v-for="story in stories">
              <div v-bind:key="story"  class="card card-story bg-lime-2">
                <div class="card-title">
                  <input
                    type="checkbox"
                    v-model="selected.stories"
                    id="story.id"
                    :value="story"
                  >
                    <label>{{story.name}}</label>
                    <div>
                      <label class="text-grey-9">{{story.desc}}</label>
                    </div>
                </div>
              </div>
            </div>
            <button @click="doImport" class="primary">Import</button>
            <button @click="selectAll" class="primary">Select all</button>
            <button
              :class="{'primary': selectedStories, 'disabled': !selectedStories}"
              @click="deselectAll"
            >
              Deselect all
            </button>
            <button @click="goBack" class="primary">Back</button>
          </div>
          <div v-else>
            There's no stories to be imported
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script src="./from-trello.js"></script>

<style lang="sass" src="./from-trello.sass"></style>
