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
            <form-control
              v-model="user.profile.name"
              :errors="errors.name"
              icon="address-card-o"
              placeholder="Display name"
            />

            <form-control
              v-model="user.profile.bio"
              :errors="errors.bio"
              icon="commenting"
              placeholder="Bio"
            />

            <form-control
              v-model="user.profile.contact"
              :errors="errors.contact"
              icon="phone"
              placeholder="Contact"
            />

            <form-control
              v-model="user.profile.location"
              :errors="errors.location"
              icon="globe"
              placeholder="Location"
            />

            <form-control
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

<script src="./edit.js"></script>
