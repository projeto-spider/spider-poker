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
            <img :src="gravatar(user.email)" alt="Avatar"/>
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
                  class="button is-danger"
                  @click.prevent="deleteUser"
                >
                  Delete
                </button>
              </p>

              <p class="control">
                <button
                  type="submit"
                  :disabled="status === 'loading'"
                  class="button is-primary"
                >
                  Update
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
  import gravatar from 'gravatar'
  import store from 'app/store'
  import {Users, parseErrors} from 'app/api'
  import {HeroTitle, ErrorableInput} from 'app/components'

  export default {
    name: 'UserEditView',

    components: {HeroTitle, ErrorableInput},

    data() {
      return {
        status: 'not-asked',

        errors: {
          bio: [],
          contact: [],
          location: [],
          name: [],
          url: [],
        }
      }
    },

    methods: {
      gravatar(email) {
        return gravatar.url(email, {size: 512})
      },

      submit() {
        if (this.status === 'loading') {
          return;
        }

        this.status = 'loading';

        const id = this.user.id;
        const attributes = R.pipe(
          R.view(R.lensPath(['user', 'profile'])),
          R.pick(['bio', 'contact', 'location', 'name', 'url'])
        )(this)

        Users.update(id, attributes)
          .then(profile => {
            this.status = 'success'

            store.commit('auth/set_user', {
              ...this.user,
              profile
            })

            this.errors = R.mapObjIndexed(() => [], this.errors)
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
      },

      deleteUser() {
        if (confirm('Are you sure you want to delete your account?')) {
          const id = R.view(R.lensPath(['user', 'id']), this)

          Users.delete(id)
            .then(() => {
              store.commit("auth/set_token", '');
              store.commit("auth/set_user", null);
              this.$router.push({name: 'home'});
            })
        }
      }
    },

    computed: {
      ...mapState({
        user: R.pipe(
          R.view(R.lensPath(['auth', 'user'])),
          R.clone
        )
      })
    }
  }
</script>
