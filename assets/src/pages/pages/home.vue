<template>
  <main class="columns">
    <div class="column">
      <user-block :user="loggedUser"></user-block>
    </div>
    <div class="column">
      <memberships-block :user="loggedUser"></memberships-block>
    </div>
  </main>
</template>

<script src="./home.js"></script>
