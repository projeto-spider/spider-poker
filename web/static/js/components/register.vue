<template lang="pug">
  div
    p(class='login-box-msg', v-if='status === "not-asked"') Sign up to start using Planning Poker

    .progress.progress-sm.active(v-if='status == "loading"')
      .progress-bar.progress-bar-success.progress-bar-striped(
        role='progressbar',
        aria-valuenow='100',
        aria-valuemin='0',
        aria-valuemax="100",
        style="width: 100%"
      )
        span.sr-only Loading

    .callout.callout-danger(v-if="status == 'errored'")
      h4 Register fail
      p Verify your data

    .callout.callout-success(v-if="status == 'success'")
      h4 Register success
      p Redirecting you to the login page

    form(method="post", '@submit.prevent'='submit', '@keyup.13'='submit')
      errorable-input(
        v-model="username",
        ':errors'="errors.username",
        icon='user',
        placeholder="Username"
      )
      errorable-input(
        v-model="email",
        ':errors'="errors.email",
        icon='envelope',
        placeholder="Email"
      )
      errorable-input(
        v-model="password",
        ':errors'="errors.password",
        icon='lock',
        placeholder="Password",
        type='password'
      )
      errorable-input(
        v-model="password_confirmation",
        ':errors'="errors.password_confirmation",
        icon='lock',
        placeholder="Password confirmation",
        type='password'
      )
      button(
        type="submit",
        class="btn btn-primary btn-block btn-flat"
        ':disabled'="status === 'loading'"
      ) Sign Up
    .social-auth-links.text-center
      p - OR -
    router-link(':to'="{name: 'login'}") I already have a membership
</template>

<script>
  import {R} from 'app/utils';
  import Auth from 'app/api/auth';
  import store from 'app/state';
  import {ErrorableInput} from 'app/partials';

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

        Auth.signup(R.pick([
          'username', 'email', 'password', 'password_confirmation'
        ])(this))
          .then(res => {
            this.$router.push({name: 'login', query: {username: res.data.username}});
            this.status = 'success';
          })
          .catch(res => {
            const errors = R.view(R.lensPath(['body', 'errors']), res)

            if (errors) {
              R.map(key => {
                this.errors[key] = R.prop(key, errors) || [];
              }, R.keys(this.errors))
            }
            this.status = 'errored';
          })
      }
    }
  }
</script>
