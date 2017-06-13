<template>
  <div>
    <h4>Creating Organization</h4>

    <form @submit.prevent="create">
      <div class="floating-label">
        <input required autofocus class="full-width" v-model="name">
        <label>Name</label>
      </div>
    </form>
  </div>
</template>

<script src="./add-organization.js"></script>
