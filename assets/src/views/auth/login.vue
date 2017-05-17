<template>
  <div>
    <div v-if="status == 'errored'" class="callout callout-danger">
      <h4>Login fail</h4>
      <p>Verify your data</p>
    </div>

    <div v-if="status == 'success'" class="callout callout-success">
      <h4>Login success</h4>
      <p>Redirecting you to the homepage</p>
    </div>

    <form
      method="post"
      @submit.prevent="submit"
      @keyup.13="submit"
    >
      <form-control
        v-model="username"
        :errors="[]"
        icon="user"
        placeholder="Username"
      />

      <form-control
        v-model="password"
        :errors="[]"
        icon="lock"
        placeholder="Password"
        type="password"
      />

      <div class="control is-grouped has-addons has-addons-centered">
        <p class="control">
          <router-link :to="{name: 'register'}" class='button is-link'>
            Sign up
          </router-link>
        </p>

        <p class="control">
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="button is-primary"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  </div>
</template>

<script src="./login.js"></script>
