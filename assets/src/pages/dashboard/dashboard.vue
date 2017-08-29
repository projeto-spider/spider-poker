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
        <gravatar
          :email="loggedUser.email"
          :size="32"
          :circle="true"
        ></gravatar>

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
        <timer :time="game.time" :state="game.state"></timer>

        <template v-if="isManager">
          <div @click="stopGame" class="item item-link">
            <i class="item-primary">stop</i>
            <div class="item-content">End game</div>
          </div>
        </template>
      </div>

      <div class="list platform-delimiter">
        <div class="item">
          <div class="item-content"><small class="text-faded">Projects</small></div>
          <div class="item-secondary"><i @click="promptCreateProject" style="cursor: pointer">add</i></div>
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
        :story="backlog.find(s => s.id === game.story_id)"
      ></game-layout>

      <stories
        v-else
        :channel="channel"
        :backlog="backlog"
      ></stories>
    </div>
  </q-layout>
</template>

<script src="./dashboard.js"></script>
<style lang="sass" src="./dashboard.sass"></style>
