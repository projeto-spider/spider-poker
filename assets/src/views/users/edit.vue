<template>
  <main>
    <hero-title
      text="Updating profile"
      :subtitle="`@${user.username}`"
    />

    <hero-title
      v-if="status === 'errored'"
      text="Failed to update"
      color="danger"
    />

    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <div class="image">
            <gravatar :email="user.email" :size="512"></gravatar>
          </div>
        </div>

        <div class="column">
          <form
            method="post"
            @submit.prevent="submit"
            @keyup.13="submit"
          >
            <errorable-input
              v-model="user.profile.name"
              :errors="errors.name"
              icon="address-card-o"
              placeholder="Display name"
            />

            <errorable-input
              v-model="user.profile.bio"
              :errors="errors.bio"
              icon="commenting"
              placeholder="Bio"
            />

            <errorable-input
              v-model="user.profile.contact"
              :errors="errors.contact"
              icon="phone"
              placeholder="Contact"
            />

            <errorable-input
              v-model="user.profile.location"
              :errors="errors.location"
              icon="globe"
              placeholder="Location"
            />

            <errorable-input
              v-model="user.profile.url"
              :errors="errors.url"
              icon="link"
              placeholder="URL"
            />

            <div class="control is-grouped has-addons has-addons-centered">
              <p class="control">
                <button
                  type="submit"
                  :disabled="status === 'loading'"
                  class="button is-primary"
                >
                  Update
                </button>
              </p>

              <p class="control">
                <button
                  type="submit"
                  :disabled="status === 'loading'"
                  class="button is-danger"
                  @click.prevent="deleteUser"
                >
                  Delete
                </button>
              </p>

            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import {mapState} from 'vuex'
  import R from 'ramda'
  import store from 'app/store'
  import {Users} from 'app/api'
  import {insertChangesetErrors} from 'app/utils'
  import {HeroTitle, ErrorableInput, Gravatar} from 'app/components'

  const emptyErrors = {
    bio: [],
    contact: [],
    location: [],
    name: [],
    url: []
  }

  const userIdView = R.view(R.lensPath(['user', 'id']))

  export default {
    name: 'UserEditView',

    components: {HeroTitle, ErrorableInput, Gravatar},

    data() {
      return {
        status: 'not-asked',

        errors: emptyErrors
      }
    },

    computed: {
      ...mapState({
        user: R.pipe(
          R.view(R.lensPath(['auth', 'user'])),
          R.clone
        )
      })
    },

    methods: {
      async submit() {
        if (this.status === 'loading') {
          return
        }

        this.status = 'loading'

        const id = userIdView(this)

        const attributes = R.pipe(
          R.view(R.lensPath(['user', 'profile'])),
          R.pick(['bio', 'contact', 'location', 'name', 'url'])
        )(this)

        try {
          const res = await Users.update(id, attributes)
          const user = res.data

          this.status = 'success'

          store.commit('auth/set_user', {
            ...this.user,
            user
          })

          this.errors = emptyErrors
        } catch (res) {
          this.errors = insertChangesetErrors(res.errors)(emptyErrors)

          this.status = 'errored'
        }
      },

      async deleteUser() {
        if (confirm('Are you sure you want to delete your account?')) {
          const id = userIdView(this)

          await Users.delete(id)

          store.commit('auth/set_token', '')
          store.commit('auth/set_user', null)
          this.$router.push({name: 'home'})
        }
      }
    }
  }
</script>
