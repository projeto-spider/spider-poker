<template>
  <main>
    <hero-title
      text="Creating organization"
    />

    <div class="row">
      <div class="column is-half is-offset-one-quarter">
        <div class="box">
          <div v-if="status == 'errored'">
            <div class="callout callout-danger cotainer has-text-centered">
              <h4>Register organization fail</h4>
              <p>Verify your organization data</p>
            </div>
          </div>

          <div v-if="status == 'success'">
            <div class="callout callout-success cotainer has-text-centered">
              <h4>Register success</h4>
              <p>Redirecting you to the organization page</p>
            </div>
          </div>

          <form
            method="post"
            @submit.prevent="submit"
            @keyup.13="submit"
          >

            <errorable-input
              v-model="name"
              :errors="errors.name"
              icon="building-o"
              placeholder="Organization name"
            />

            <errorable-input
              v-model="displayName"
              :errors="errors.displayName"
              icon="briefcase"
              placeholder="Display name"
            />

            <errorable-input
              v-model="description"
              :errors="errors.description"
              icon="id-card"
              placeholder="Description"
            />

            <errorable-input
              v-model="location"
              :errors="errors.location"
              icon="map-marker"
              placeholder="Location"
            />

           <errorable-input
              v-model="url"
              :errors="errors.url"
              icon="link"
              placeholder="Url"
            />

            <label class="label">Organization type</label>

             <p class="control">
              <label class="radio">
                <input v-model="private" value="0" type="radio">
                  Public
              </label>
              <label class="radio">
                <input v-model="private" value="1" type="radio">
                  Private
              </label>
            </p>

            <div class="control is-grouped has-addons has-addons-centered">
             <p class="control">
                <button type="submit" class="button is-primary">
                  Register
                </button>

              <p class="control">
                <router-link :to="{name: 'home'}" class="button is-primary">
                  Cancel
                </router-link>
              </p>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import R from 'ramda'
  import {Organizations} from 'app/api'
  import {HeroTitle, ErrorableInput} from 'app/components'
  import {insertChangesetErrors} from 'app/utils'

  const emptyErrors = {
    name: [],
    displayName: [],
    description: [],
    location: [],
    url: [],
    private: []
  }

  export default {
    name: 'OrganizationsCreateView',

    components: {
      HeroTitle, ErrorableInput
    },

    data() {
      return {
        name: '',
        displayName: '',
        description: '',
        location: '',
        url: '',
        private: '0',
        status: 'not-asked',
        errors: emptyErrors
      }
    },

    methods: {
      async submit() {
        if (this.status === 'loading') {
          return
        }

        this.status = 'loading'

        const attributes = R.pick([
          'name', 'displayName', 'description', 'location', 'url', 'private'
        ], this)

        try {
          const org = await Organizations.create(attributes)

          const name = R.prop('name', org)

          this.$router.push({name: 'organizationShow', params: {organization: name}})

          this.status = 'success'
        } catch (res) {
          this.errors = insertChangesetErrors(res.errors)(emptyErrors)

          this.status = 'errored'
        }
      }
    }
  }
</script>
