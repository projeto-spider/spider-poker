<template>
  <one-box-layout>
    <span slot="title">Settings</span>

    <form @submit.prevent="update">
      <p>
        <div class="stacked-label">
          <input class="full-width" v-model="form.display_name">
          <label>Display name</label>
        </div>
        <ul>
          <li v-for="error in errors.display_name" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

      <p>
        <div class="stacked-label">
          <input class="full-width" v-model="form.contact">
          <label>Contact</label>
        </div>
      </p>

      <p>
        <div class="stacked-label">
          <input class="full-width" v-model="form.location">
          <label>Location</label>
        </div>
      </p>

      <p>
        <div class="stacked-label">
          <input class="full-width" v-model="form.url">
          <label>Url</label>
        </div>
        <ul>
          <li v-for="error in errors.url" class="text-negative">
            {{error}}
          </li>
        </ul>
      </p>

       <p>
        <div class="stacked-label">
          <textarea class="full-width" v-model="form.bio"></textarea>
          <label>Bio</label>
        </div>
      </p>

      <p>
        <div class="flex">
          <button type="submit" class="primary" @click="update">
            Update
          </button>

          <router-link :to="{name: 'Dashboard'}" tag="button" class="clear">
            Cancel
          </router-link>
        </div>
      </p>
    </form>
  </one-box-layout>
</template>

<script src="./settings.js"></script>
