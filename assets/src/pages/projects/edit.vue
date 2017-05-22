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
        <form-control
          v-model="project.displayName"
          :errors="errors.displayName"
          icon="sticky-note"
          placeholder="Display name"
        />

        <form-control
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

<script src="./edit.js"></script>
