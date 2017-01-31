<template>
  <div>
    <div v-if="status == 'errored'" class="callout callout-danger">
      <h4>Register fail</h4>
      <p>Verify your data</p>
    </div>

    <div v-if="status == 'success'" class="callout callout-success">
      <h4>Register success</h4>
      <p>Redirecting you to the login page</p>
    </div>

    <form
      method="post"
      @submit.prevent="submit"
      @keyup.13="submit"
    >
      <errorable-input
        v-model="username"
        :errors="errors.username"
        icon="user"
        placeholder="Username"
      />

      <errorable-input
        v-model="email"
        :errors="errors.email"
        icon="envelope"
        placeholder="Email"
      />

      <errorable-input
        v-model="password"
        :errors="errors.password"
        icon="lock"
        placeholder="Password"
        type="password"
      />

      <errorable-input
        v-model="password_confirmation"
        :errors="errors.password_confirmation"
        icon="lock"
        placeholder="Password confirmation"
        type="password"
      />

      <div class="control is-grouped has-addons has-addons-centered">
        <p class="control">
          <router-link :to="{name: 'login'}" class='button is-link'>
            Sign In
          </router-link>
        </p>

        <p class="control">
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="button is-primary"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
  import R from 'ramda';
  import {Users, parseErrors} from 'app/api';
  import {ErrorableInput} from 'app/components';

  export default {
    name: 'Register',

    components: {
      'errorable-input': ErrorableInput,
    },

    data() {
      return {
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 'not-asked',
        errors: {
          username: [],
          email: [],
          password: [],
          password_confirmation: []
        },
      };
    },

    methods: {
      submit() {
        if (this.status === 'loading') {
          return;
        }

        this.status = 'loading';

        Users.create(R.pick([
          'username', 'email', 'password', 'password_confirmation'
        ])(this))
          .then(res => {
            const username = R.view(R.lensPath(['data', 'attributes', 'username']), res)
            this.$router.push({name: 'login', query: {username}});
            return this.status = 'success';
          })
          .catch(res => {
            res.json()
              .then(res => {
                const errors = R.pipe(
                  R.prop('errors'),
                  parseErrors
                )(res)

                if (errors) {
                  R.pipe(
                    R.keys,
                    R.map(key => {
                      this.errors[key] = R.prop(key, errors) || [];
                    })
                  )(this.errors)
                }

                this.status = 'errored';
              })
          })
      }
    }
  }
</script>
