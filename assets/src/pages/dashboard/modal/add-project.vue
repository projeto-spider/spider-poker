<template>
  <div>
    <h4>Creating Project</h4>

    <form @submit.prevent="create">
      <q-select
        type="list"
        v-model="organization"
        :options="selectOptions"
      ></q-select>

      <div class="floating-label">
        <input required autofocus class="full-width" v-model="name">
        <label>Name</label>
      </div>
    </form>
  </div>
</template>

<script src="./add-project.js"></script>
