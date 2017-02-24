<template>
  <main>
    <hero-title
      text="Updating organization"
    />

    <hero-title
      v-if="status === 'errored'"
      text="Failed to update"
      color="danger"
    />

    <div v-if="organization !== null" class="column is-half is-offset-one-quarter">
      <form
        method="post"
        @submit.prevent="submit"
        @keyup.13="submit"
      >
        <errorable-input
          v-model="organization.displayName"
          :errors="errors.displayName"
          icon="briefcase"
          placeholder="Display name"
        />

        <errorable-input
          v-model="organization.description"
          :errors="errors.description"
          type="textarea"
          icon="id-card"
          placeholder="Description"
        />

        <errorable-input
          v-model="organization.location"
          :errors="errors.location"
          icon="map-marker"
          placeholder="Location"
        />

        <errorable-input
          v-model="organization.url"
          :errors="errors.url"
          icon="link"
          placeholder="URL"
        />

        <label class="label">Organization type</label>

         <p class="control">
          <label class="radio">
            <input :checked="organization.private === false" @click="organization.private = false" type="radio">
              Public
          </label>
          <label class="radio">
            <input :checked="organization.private === true" @click="organization.private = true" type="radio">
              Private
          </label>
        </p>

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
              @click.prevent="deleteOrganization"
            >
              Delete
            </button>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
  import R from 'ramda'
  import {Organizations} from 'app/api'
  import {insertChangesetErrors} from 'app/utils'
  import {HeroTitle, ErrorableInput} from 'app/components'

  const emptyErrors = {
    displayName: [],
    description: [],
    contact: [],
    location: [],
    url: [],
    private: []
  }

  const organizationIdView = R.view(R.lensPath(['organization', 'id']))

  export default {
    name: 'OrganizationEditView',

    components: {
      HeroTitle, ErrorableInput
    },

    data() {
      return {
        status: 'not-asked',
        organization: null,
        private: '',

        errors: emptyErrors
      }
    },

    async created() {
      this.status = 'loading'

      const orgs = await Organizations.show(this.$route.params.organization)

      if (orgs.length === 0) {
        this.status = 'errored'
        return
      }
      this.status = 'success'

      this.organization = orgs[0]
    },

    methods: {
      async submit() {
        if (this.status === 'loading') {
          return
        }

        this.status = 'loading'

        const id = organizationIdView(this)

        const attributes = R.pipe(
          R.view(R.lensPath(['organization'])),
          R.pick(['displayName', 'description', 'location', 'url', 'private'])
        )(this)

        attributes.display_name = attributes['display-name']

        try {
          await Organizations.update(id, attributes)

          this.status = 'success'

          this.errors = emptyErrors
        } catch (res) {
          this.errors = insertChangesetErrors(res.errors)(emptyErrors)

          this.status = 'errored'
        }
      },

      async deleteOrganization() {
        if (confirm('Are you sure you want to delete this organization?')) {
          const id = organizationIdView(this)

          await Organizations.delete(id)

          this.$router.push({name: 'home'})
        }
      }
    }
  }
</script>
