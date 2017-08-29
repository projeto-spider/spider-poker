<template>
  <one-box-layout>
    <span slot="title">Profile</span>
      <avatar
        v-if="user"
        class="avatar-center"
        :user="user"
        :size="112"
        :circle="true"
      ></avatar>

      <h5 class="centered">@{{user.display_name}}</h5>
      <h6 class="centered">{{user.username}}</h6>

      <hr/>
      <br/>

      <p v-if="user.bio" class="centered">{{user.bio}}</p>
      <div v-if="user" class="panel">
        <p v-for="info in userInfo" class="panel-block">
          {{info}}
        </p>
      </div>

      <br/>

      <button v-if="currentUserIsSelf" type="submit" class="primary" v-link="'/user/settings'">
        Edit
      </button>
  </one-box-layout>
</template>

<script src="./profile.js"></script>

<style lang="sass" src="./profile.sass"></style>
