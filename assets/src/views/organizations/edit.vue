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

<script src="./edit.js"></script>
