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
          v-if="selectedProjectId"
          tag="div"
          class="item item-link"
          :to="{name: 'Game', params: {projectId: selectedProjectId}}"
        >
          <i class="item-primary">games</i>

          <div class="item-content">
            Start Game
          </div>
        </router-link>

        <div
          class="item item-link"
          @click="askOrganizationName"
        >
          <i class="item-primary">group_add</i>

          <div class="item-content">
            Create Organization
          </div>
        </div>

        <div
          class="item item-link"
          @click="askProjectName"
        >
          <i class="item-primary">playlist_add</i>
          <div class="item-content">
            Create Project
          </div>
        </div>

        <div
          class="item item-link"
          @click="$refs.editOrganizationModal.open()"
        >
          <i class="item-primary">group</i>
          <div class="item-content">
            Edit Organization
          </div>
        </div>

        <div
          class="item item-link"
          @click="$refs.editProjectModal.open()"
        >
          <i class="item-primary">list</i>
          <div class="item-content">
            Edit Project
          </div>
        </div>
      </div>

      <div class="list platform-delimiter">
        <div class="list-label">Organizations</div>

        <q-collapsible
          v-for="org in organizations"
          :key="`org-${org.id}`"
          :icon="org.private ? 'lock' : 'label'"
          :label="org.display_name || org.name"
        >
          <div
            v-for="proj in projects.filter(proj => proj.organization_id === org.id)"
            :key="`proj-${proj.id}`"
            class="item item-link item-inset-delimiter"
            @click="selectProject(proj.id)"
          >
            <i class="item-primary">{{proj.private ? 'lock_outline' : 'label_outline'}}</i>

            <div class="item-content">
              {{proj.display_name || proj.name}}
            </div>
          </div>
        </q-collapsible>
      </div>
    </q-drawer>

    <div class="layout-view">
      <project
        :socket="socket"
        :project="selectedProject"
       ></project>
    </div>

    <q-modal ref="editOrganizationModal" content-classes="modal-edition">
      <edit-organization-modal
        :modal="$refs.editOrganizationModal"
        :organizations="organizations"
      ></edit-organization-modal>
    </q-modal>

    <q-modal ref="editProjectModal" content-classes="modal-edition">
      <edit-project-modal
        :modal="$refs.editProjectModal"
        :projects="projects"
      ></edit-project-modal>
    </q-modal>
  </q-layout>
</template>

<script src="./dashboard.js"></script>
<style lang="sass" src="./dashboard.sass"></style>
