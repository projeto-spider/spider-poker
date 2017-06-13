<template>
  <auth-layout>
    <span slot="title">Login</span>

    <form @submit.prevent="login">
      <p>
        <div class="floating-label">
          <input required class="full-width" v-model="username">
          <label>Username</label>
        </div>
      </p>

      <p>
        <div class="floating-label">
          <input type="password" required class="full-width" v-model="password">
          <label>Password</label>
        </div>
      </p>

      <p>
        <div class="flex">
          <button type="submit" class="primary" @click="login">
            Login
          </button>
        </div>
      </p>
    </form>
  </auth-layout>
</template>

<script src="./login.js"></script>
