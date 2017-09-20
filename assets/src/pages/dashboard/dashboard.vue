<template>
  <q-layout>
    <!-- Header -->
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible menu-button" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>

      <img src="../../assets/logo-mini.png">

      <q-toolbar-title :padding="1">
        Spider Poker
      </q-toolbar-title>

      <button @click="tryFullScreen">
        <i>fullscreen</i>
      </button>

      <div ref="user-popover-target" class="primary">
        <avatar
          :user="loggedUser"
          :size="32"
          :circle="true"
          style="max-width: 36px"
        ></avatar>

        <q-popover ref="userPopover" anchor="bottom left" self="top right">
          <div class="list item-delimiter highlight">
            <div
              class="item item-link"
              @click="$refs.userPopover.close(), $router.push({name: 'Profile', params: {username: loggedUser.username}})"
            >
              <div class="item-content">Profile</div>
            </div>

            <div
              class="item item-link"
              @click="$refs.userPopover.close(), $router.push({name: 'UserSettings'})"
            >
              <div class="item-content">Settings</div>
            </div>

            <div
              class="item item-link"
              @click="$refs.userPopover.close(), $router.push({name: 'Logout'})"
            >
              <div class="item-content">
                Logout
              </div>
            </div>
          </div>
        </q-popover>
      </div>
    </div>

    <q-drawer ref="leftDrawer">
      <div v-if="inGame" class="list platform-delimiter">
        <div v-if="currentGameStateLabel" class="toolbar bg-secondary">
          <q-toolbar-title style="text-align: center">
            {{currentGameStateLabel}}
          </q-toolbar-title>
        </div>

        <timer :game="game"></timer>

        <template v-if="isManager">
          <div @click="stopGame" class="item item-link">
            <i class="item-primary">stop</i>
            <div class="item-content">End game</div>
          </div>

          <template>
            <div v-if="!voting" @click="startVoting" class="item item-link">
              <i class="item-primary">star</i>

              <template>
                <div v-if="created" class="item-content">Start voting</div>
                <div v-else class="item-content">Restart voting</div>
              </template>
            </div>

            <div v-else @click="stopVoting" class="item item-link">
              <i class="item-primary">stop</i>
              <div class="item-content">Stop voting</div>
            </div>
          </template>

          <div v-if="discussion" @click="score" class="item item-link">
            <i class="item-primary">stars</i>
            <div class="item-content">Final estimation</div>
          </div>

          <div v-if="discussion && backlog.find(s => s.id === game.story_id)" @click="createSubstory" class="item item-link">
            <i class="item-primary">add</i>
            <div class="item-content">Create Substory</div>
          </div>
        </template>

        <div v-if="voting" @click="vote" class="item item-link">
          <i class="item-primary">thumbs_up_down</i>
          <div class="item-content">Vote</div>
        </div>
      </div>

      <div v-if="inGame" class="list platform-delimiter">
        <presence
          :online="onlineMembers"
          :offline="offlineMembers"
          :state="game.state"
          :votes="game.votes"
        ></presence>
      </div>

      <div class="list platform-delimiter">
        <div class="item">
          <div class="item-content"><small class="text-faded">Projects</small></div>
          <div class="item-secondary"><i @click="$refs.CreateProjectModal.open()" style="cursor: pointer">add</i></div>
        </div>

        <div
          v-if="selectedProject && !inGame"
          class="item item-link"
          @click="$refs.gamesModal.open()"
        >
          <i class="item-primary">history</i>
          <div class="item-content">
            Games History
          </div>
        </div>

        <div
          v-if="selectedProject && !inGame"
          class="item item-link"
          @click="$refs.importationModal.open()"
        >
          <i class="item-primary">import_export</i>
          <div class="item-content">
            Import stories
          </div>
        </div>

        <project-item
          v-for="project in projects"
          :key="project.id"
          :project="project"
        ></project-item>
      </div>
    </q-drawer>

    <div class="layout-view">
      <game-layout
        v-if="inGame"
        :game="game"
        :story="stories[game.story_id]"
        :chat="chat"
        :sendMessage="sendMessage"
        :promptNewPosition="promptNewPosition"
        :promptStoryUpdate="promptStoryUpdate"
        :confirmStoryDeletion="confirmStoryDeletion"
      ></game-layout>

      <stories
        v-else
        :channel="channel"
        :backlog="backlog"
        :promptNewPosition="promptNewPosition"
        :promptStoryUpdate="promptStoryUpdate"
        :confirmStoryDeletion="confirmStoryDeletion"
      ></stories>
    </div>

    <q-modal ref="importationModal" content-classes="modal-edition">
      <import-modal
        :modal="$refs.importationModal"
        :projects="projects"
        :currentProject="selectedProject"
        :importStories="importStories"
      ></import-modal>
    </q-modal>

    <q-modal ref="gamesModal" class="maximized">
      <games-modal
        v-if="$refs.gamesModal && $refs.gamesModal.active"
        :modal="$refs.gamesModal"
      ></games-modal>
    </q-modal>

    <q-modal 
      ref="CreateProjectModal" 
      :content-css="{minWidth: '30vw', minHeight: '50vh'}" 
      @close="modalCloser()"
    >
      <q-layout>
        <div slot="header" class="toolbar">
          <q-toolbar-title :padding="1">
            Creating project
          </q-toolbar-title>
        </div>

        <div slot="header" class="toolbar bg-white">
          <q-autocomplete
            class="full-width text-dark"
            v-model="selectedOrg"
            :delay="0"
            @search="searchOrganization"
            @selected=""
          >
            <q-search
              v-model="selectedOrg"
              :debounce="600"
              placeholder="Organization name (optional)"
            ></q-search>
          </q-autocomplete>
        </div>

        <div class="layout-padding">
          <div class="floating-label">
            <input required class="full-width" v-model="projectName">
            <label>Project name</label>
          </div>
        </div>

        <div slot="footer" class="item multiple-lines">
          <div class="item-content">
            <button 
              type="submit" 
              @click="startProject(projectName, selectedOrg), $refs.CreateProjectModal.close()" 
              class="primary"
            >
              Create
            </button>
            <button type="button" @click="$refs.CreateProjectModal.close()" class="negative">Cancel</button>
          </div>
        </div>
      </q-layout>
    </q-modal>
  </q-layout>
</template>

<script src="./dashboard.js"></script>
<style lang="sass" src="./dashboard.sass"></style>
