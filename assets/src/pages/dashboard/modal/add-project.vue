<template>
  <div>
    <h4>Creating Project</h4>

    <form @submit.prevent="create">
      <p>
        <q-select
          type="list"
          v-model="organization"
          :options="selectOptions"
        ></q-select>
      </p>

      <p>
        <div class="floating-label">
          <input required autofocus class="full-width" v-model="name">
          <label>Name</label>
        </div>
      </p>
    </form>

    <p><button class="primary" @click="modal.close">Close</button></p>
  </div>
</template>

<script src="./add-project.js"></script>
