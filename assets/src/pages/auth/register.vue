<template>
  <auth-layout>
    <span slot="title">Register</span>

    <form @submit.prevent="register">
      <p>
        <div class="floating-label">
          <input
            required class="full-width"
            :class="{'has-errors': errors.username.length}"
            v-model="username"
          >
          <label>Username</label>
        </div>
        <ul>
          <li v-for="error in errors.username" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

      <p>
        <div class="floating-label">
          <input
            type="password" required class="full-width"
            :class="{'has-errors': errors.password.length}"
            v-model="password"
          >
          <label>Password</label>
        </div>
        <ul>
          <li v-for="error in errors.password" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

      <p>
        <div class="floating-label">
          <input
            type="password" required class="full-width"
            :class="{'has-errors': errors.password_confirmation.length}"
            v-model="password_confirmation"
          >
          <label>Confirm Password</label>
        </div>
        <ul>
          <li v-for="error in errors.password_confirmation" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

      <p>
        <div class="floating-label">
          <input
            type="Email" required class="full-width"
            :class="{'has-errors': errors.email.length}"
            v-model="email"
          >
          <label>Email</label>
        </div>
        <ul>
          <li v-for="error in errors.email" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

      <p>
        <div class="flex">
          <button type="submit" class="primary" @click="register">
            Register
          </button>

          <router-link :to="{name: 'Login'}" tag="button" class="clear">
            I already have an account
          </router-link>
        </div>
      </p>
    </form>
  </auth-layout>
</template>

<script src="./register.js"></script>
