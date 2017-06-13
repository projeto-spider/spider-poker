<template>
  <div>
    <h4>Creating Organization</h4>

    <form @submit.prevent="create">
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

<script src="./add-organization.js"></script>
