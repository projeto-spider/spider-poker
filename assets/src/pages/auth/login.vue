<template>
  <one-box-layout>
    <span slot="title">Login</span>

    <form @submit.prevent="tryLogin">
      <p>
        <div class="floating-label">
          <input required class="full-width" v-model="email">
          <label>Email</label>
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
          <button type="submit" class="primary" @click="tryLogin">
            Login
          </button>

          <router-link :to="{name: 'Register'}" tag="button" class="clear">
            I don't have an account
          </router-link>
        </div>
      </p>
    </form>
  </one-box-layout>
</template>

<script src="./login.js"></script>
