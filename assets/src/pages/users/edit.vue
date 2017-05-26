<template>
  <main class="columns is-marginless">
    <div class="column is-paddingless">
      <user-block :user="user"></user-block>
    </div>
    <div class="column is-paddingless">
      <form
        method="post"
        @submit.prevent="submit"
        @keyup.13="submit"
      >
        <form-control
          v-model="user.displayName"
          :errors="errors.name"
          icon="address-card-o"
          placeholder="Display name"
        />

        <br/>

        <form-control
          v-model="user.bio"
          :errors="errors.bio"
          icon="commenting"
          placeholder="Bio"
        />

        <br/>

        <form-control
          v-model="user.contact"
          :errors="errors.contact"
          icon="phone"
          placeholder="Contact"
        />

        <br/>

        <form-control
          v-model="user.location"
          :errors="errors.location"
          icon="globe"
          placeholder="Location"
        />

        <br/>

        <form-control
          v-model="user.url"
          :errors="errors.url"
          icon="link"
          placeholder="URL"
        />

        <hr/>

        <div class="block">
          <a
            type="submit"
            :disabled="status === 'loading'"
            class="button is-primary"
            @click="submit"
          >
            Update
          </a>
          <a
            type="submit"
            :disabled="status === 'loading'"
            class="button is-danger"
            @click.prevent="deleteUser"
          >
            Delete
          </a>
        </div>
      </form>
    </div>
  </main>
</template>

<script src="./edit.js"></script>
