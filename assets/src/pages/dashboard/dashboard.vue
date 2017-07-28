<template>
  <q-layout>
    <!-- Header -->
    <div slot="header" class="toolbar">
      <!-- opens left-side drawer using its ref -->
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>

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

    <!-- Left-side Drawer -->
    <q-drawer ref="leftDrawer">
      <div class="list no-border platform-delimiter">
        <router-link
          v-if="selectedProject"
          tag="div"
          class="item item-link"
          :to="{name: 'Game', params: {projectId: selectedProject.id}}"
        >
          <i class="item-primary">games</i>

          <div class="item-content">
            Start Game
          </div>
        </router-link>
      </div>

      <div class="list platform-delimiter">
        <div class="item">
          <div class="item-content"><small class="text-faded">Projects</small></div>
          <div class="item-secondary"><i @click="promptCreateProject" style="cursor: pointer">add</i></div>
        </div>

        <main-drawer-project
          v-for="project in projects"
          :key="project"
          :project="project"
        ></main-drawer-project>
      </div>
    </q-drawer>

    <div class="layout-view">
      <project
        :socket="socket"
       ></project>
    </div>
  </q-layout>
</template>

<script src="./dashboard.js"></script>
<style lang="sass" src="./dashboard.sass"></style>
