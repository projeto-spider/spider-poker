<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close()">
          <i>keyboard_arrow_left</i>
        </button>

        Creating Organization
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <div class="layout-padding">
        <form @submit.prevent="create">
          <p>
            <div class="floating-label">
              <input required autofocus class="full-width" v-model="name">
              <label>Name</label>
            </div>
          </p>
        </form>
      </div>
    </div>
  </q-layout>
</template>

<script src="./add-organization.js"></script>
