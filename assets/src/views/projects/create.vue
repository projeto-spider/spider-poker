<template>
  <main>
    <hero-title
      text="Starting a new project"
    />

    <div  v-if="organization !== null" class="row">
      <div class="column is-half is-offset-one-quarter">
        <div class="box">
          <div v-if="status.project == 'errored'">
            <div class="callout callout-danger cotainer has-text-centered">
              <h4>Starting project fail</h4>
              <p>Verify your organization data</p>
            </div>
          </div>

          <div v-if="status.project == 'success'">
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
              icon="bookmark"
              placeholder="Project name"
            />

            <errorable-input
              v-model="displayName"
              :errors="errors.displayName"
              icon="sticky-note"
              placeholder="Display name"
            />

            <errorable-input
              v-model="description"
              :errors="errors.description"
              type="textarea"
              icon="comment-o"
              placeholder="Description"
            />

            <label class="label">Project type</label>

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
    private: []
  }

  const organizationIdView = R.view(R.lensPath(['organization', 'id']))

  export default {
    name: 'projectCreateView',

    components: {
      HeroTitle, ErrorableInput
    },

    data() {
      return {
        name: '',
        displayName: '',
        description: '',
        private: '0',
        status: {
          organization: 'not-asked',
          project: 'not-asked'
        },
        organization: null,
        errors: emptyErrors
      }
    },

    created() {
      this.status.organization = 'loading'

      Organizations.show(this.$route.params.organization)
        .then(({data: organization}) => {
          this.status.organization = 'success'
          this.organization = organization
        })
        .catch(() => this.status.organization = 'errored')
    },

    methods: {
      async submit() {
        if (this.status.project === 'loading') {
          return
        }

        if (this.organization === null) {
          this.status.organization = 'errored'
        }

        this.status.project = 'loading'

        const orgId = organizationIdView(this)

        const attributes = R.pick([
          'name', 'displayName', 'description', 'private'
        ], this)

        try {
          const res = await Organizations.projects.create(orgId, attributes)

          const name = R.prop('name', res.data)

          this.$router.push({name: 'projectShow', params: {project: name}})

          this.status.project = 'success'
        } catch (res) {
          this.errors = insertChangesetErrors(res.errors)(emptyErrors)

          this.status.project = 'errored'
        }
      }
    }
  }
</script>
