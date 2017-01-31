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
      <errorable-input
        v-model="username"
        :errors="[]"
        icon="user"
        placeholder="Username"
      />

      <errorable-input
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

<script>
  import R from 'ramda';
  import {Auth} from 'app/api';
  import store from 'app/store';
  import {ErrorableInput} from 'app/components';

  export default {
    name: 'Login',

    components: {
      'errorable-input': ErrorableInput,
    },

    data() {
      return {
        username: R.view(R.lensPath(['$route', 'query', 'username']), this) || '',
        password: '',
        status: 'not-asked',
      };
    },

    methods: {
      submit() {
        if (this.status === 'loading') {
          return;
        }

        this.status = 'loading';

        Auth.signin(this.username, this.password)
          .then(({token}) => {
            store.commit('auth/set_token', token);
            this.status = 'success';
            this.$router.push({name: 'home'});

            return Auth.me();
          })
          .then(user => {
            this.$store.commit('auth/set_user', user);
          })
          .catch(e => {
            this.status = 'errored';
          });
      }
    }
  }
</script>
