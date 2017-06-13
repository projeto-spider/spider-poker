<template>
  <div class="auth-page window-height window-width bg-light column items-center">
    <div class="auth-title bg-primary flex items-center justify-center">
      Login
    </div>
    <div>
      <div class="auth-card card bg-white">
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
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from 'quasar'
import axios from 'utils/axios'

export default {
  data: () => ({
    loading: false,
    username: '',
    password: ''
  }),

  methods: {
    login() {
      if (this.loading) {
        return
      }

      this.loading = true

      axios.post('/sessions', {
        data: {
          username: this.username,
          password: this.password
        }
      })
        .then(this.handleSuccess)
        .catch(this.handleFail)
    },

    handleSuccess(response) {
      this.$store.commit('set_token', response.data.token)

      axios.get('/sessions')
        .then(response => {
          this.$store.commit('set_user', response.data)
          this.$router.push({name: 'Dashboard'})
        })
    },

    handleFail(response) {
      Toast.create.negative('Failed to login')
      this.loading = false
      console.error(response)
    }
  }
}
</script>
