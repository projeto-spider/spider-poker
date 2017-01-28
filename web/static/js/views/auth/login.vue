<template lang="pug">
  div
    p(class='login-box-msg', v-if='status === "not-asked"') Sign in to start your session

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
      h4 Login fail
      p Verify your username/email and password

    .callout.callout-success(v-if="status == 'success'")
      h4 Login success
      p Redirecting you to the dashboard

    form(method="post", '@submit.prevent'='submit', '@keyup.13'='submit')
      errorable-input(
        v-model="username",
        ':errors'="[]",
        icon='user',
        placeholder="Username or Email"
      )
      errorable-input(
        v-model="password",
        ':errors'="[]",
        icon='lock',
        placeholder="Password",
        type='password'
      )
      button(
        type="submit",
        class="btn btn-primary btn-block btn-flat"
        ':disabled'="status === 'loading'"
      ) Sign In
    .social-auth-links.text-center
      p - OR -
    router-link(':to'="{name: 'register'}") Register a new membership
</template>

<script>
  import {R} from 'app/utils';
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
