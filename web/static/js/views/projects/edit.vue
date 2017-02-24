<template>
  <main>
    <hero-title
      text="Updating project"
    />

    <hero-title
      v-if="status === 'errored'"
      text="Failed to update"
      color="danger"
    />

    <div v-if="project !== null" class="column is-half is-offset-one-quarter">
      <form
        method="post"
        @submit.prevent="submit"
        @keyup.13="submit"
      >
        <errorable-input
          v-model="project.displayName"
          :errors="errors.displayName"
          icon="sticky-note"
          placeholder="Display name"
        />

        <errorable-input
          type="textarea"
          v-model="project.description"
          :errors="errors.description"
          icon="comment-o"
          placeholder="Description"
        />

        <label class="label">Project type</label>

         <p class="control">
          <label class="radio">
            <input :checked="project.private === false" @click="project.private = false" type="radio">
              Public
          </label>
          <label class="radio">
            <input :checked="project.private === true" @click="project.private = true" type="radio">
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
              @click.prevent="deleteProject"
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
  import {Projects} from 'app/api'
  import {insertChangesetErrors} from 'app/utils'
  import {HeroTitle, ErrorableInput} from 'app/components'

  const emptyErrors = {
    displayName: [],
    description: [],
    private: []
  }

  const projectIdView = R.view(R.lensPath(['project', 'id']))

  export default {
    name: 'ProjectEditView',

    components: {
      HeroTitle, ErrorableInput
    },

    data() {
      return {
        status: 'not-asked',
        project: null,
        private: '',

        errors: emptyErrors
      }
    },

    async created() {
      this.status = 'loading'

      const res = await Projects.show(this.$route.params.project)

      if (res.data.length === 0) {
        this.status = 'errored'
        return
      }
      this.status = 'success'

      this.project = res.data[0]
    },

    methods: {
      async submit() {
        if (this.status === 'loading') {
          return
        }

        this.status = 'loading'

        const projId = projectIdView(this)

        const attributes = R.pipe(
          R.view(R.lensPath(['project'])),
          R.pick(['displayName', 'description', 'private'])
        )(this)

        try {
          await Projects.update(projId, attributes)

          this.status = 'success'

          this.errors = emptyErrors
          this.$router.push({name: 'projectShow'})
        } catch (res) {
          this.errors = insertChangesetErrors(res.errors)(emptyErrors)

          this.status = 'errored'
        }
      },

      async deleteProject() {
        if (confirm('Are you sure you want to delete this project?')) {
          const projId = projectIdView(this)

          await Projects.delete(projId)

          this.$router.push({name: 'home'})
        }
      }
    }
  }
</script>
