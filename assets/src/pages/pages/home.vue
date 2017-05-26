<template>
  <main class="columns is-marginless">
    <div class="column is-paddingless">
      <user-block :user="loggedUser"></user-block>
    </div>
    <div class="column is-paddingless">
      <memberships-block :user="loggedUser"></memberships-block>
    </div>
  </main>
</template>

<script src="./home.js"></script>
