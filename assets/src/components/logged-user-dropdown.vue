<template>
  <div class="dropdown-menu">
    <ul>
      <li>
        <router-link :to="{name: 'userShow', params: {username: user.username}}">
          Profile
        </router-link>
      </li>

      <li>
        <router-link :to="{name: 'userEdit'}">
          Settings
        </router-link>
      </li>

      <li>
        <hr class="dropdown-separator"/>
      </li>

      <li>
        <router-link :to="{name: 'logout'}">
          Logout
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script src="./logged-user-dropdown.js"></script>
