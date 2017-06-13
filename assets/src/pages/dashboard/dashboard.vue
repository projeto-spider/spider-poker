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
        <div
          class="item item-link item-inset-delimiter"
          @click="$refs.organizationModal.open(), $refs.leftDrawer.close()"
        >
          <i class="item-primary">group_add</i>

          <div class="item-content">
            Create Organization
          </div>
        </div>

        <div
          class="item item-link item-inset-delimiter"
          @click="$refs.projectModal.open(), $refs.leftDrawer.close()"
        >
          <i class="item-primary">playlist_add</i>
          <div class="item-content">
            Create Project
          </div>
        </div>
      </div>

      <div class="list platform-delimiter">
        <q-collapsible
          v-for="org in organizations"
          :key="`org-${org.id}`"
          :icon="org.private ? 'lock' : 'label'"
          :label="org.name"
        >
          <router-link
            v-for="proj in projects.filter(proj => proj.organization_id === org.id)"
            :key="`proj-${proj.id}`"
            tag="div"
            class="item item-link item-inset-delimiter"
            :to="{name: 'Project', params: {projectId: proj.id}}"
            :exact="true"
            @click.native="$refs.leftDrawer.close()"
          >
            <i class="item-primary">{{proj.private ? 'lock_outline' : 'label_outline'}}</i>
            <div class="item-content">
              {{proj.name}}
            </div>
          </router-link>
        </q-collapsible>
      </div>
    </q-drawer>

    <router-view class="layout-view"></router-view>

    <q-modal ref="organizationModal" content-css="min-width: 50vw; padding: 50px 1.5em">
      <add-organization-modal
        :modal="$refs.organizationModal"
        :organizations="organizations"
      ></add-organization-modal>
    </q-modal>

    <q-modal ref="projectModal" content-css="min-width: 50vw; padding: 50px 1.5em">
      <add-project-modal
        :modal="$refs.projectModal"
        :organizations="organizations"
        :projects="projects"
      ></add-project-modal>
    </q-modal>
  </q-layout>
</template>

<script src="./dashboard.js"></script>
