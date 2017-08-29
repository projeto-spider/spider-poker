<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close()">
          <i>keyboard_arrow_left</i>
        </button>

        Importation modal
      </q-toolbar-title>
    </div>

    <template>
      <div ref="tab-import-from-project">
        <import-from-project
          :projects="projects"
          :currentProject="currentProject"
          :modal="modal"
          :importStories="importStories"
        ></import-from-project>
      </div>

      <div ref="tab-import-from-trello">
        <import-from-trello
          :currentProject="currentProject"
          :importStories="importStories"
        ></import-from-trello>
      </div>

      <div ref="tab-import-from-redmine">
        <import-from-redmine
          :currentProject="currentProject"
          :importStories="importStories"
        ></import-from-redmine>
      </div>
    </template>

    <div slot="footer" class="toolbar">
      <q-tabs
        :refs="$refs"
        default-tab="tab-import-from-project"
      >
        <q-tab name="tab-import-from-project">
          Your projects
        </q-tab>
        <q-tab name="tab-import-from-trello">
          Trello
        </q-tab>
        <q-tab name="tab-import-from-redmine">
          Redmine
        </q-tab>
      </q-tabs>
    </div>
  </q-layout>
</template>

<script src="./modal.js"></script>
