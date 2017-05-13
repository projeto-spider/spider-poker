<template>
  <section class="hero is-medium">
    <div class="hero-head">
      <nav class="nav">
        <a
          v-if="isAtLeastDesktop"
          @click.prevent="toggleSidebar"
          href="#"
          class="nav-sidebar-toggle"
        >
          <i class="fa fa-indent"></i>
        </a>

        <div v-if="isAuthenticated" class="nav-right">
          <dropdown :position="['left', 'bottom', 'center', 'top']" class="is-clickable">
            <div class="nav-item nav-profile">
              <span>{{loggedUser.displayName}} <i class="fa fa-caret-down"></i></span>
              <gravatar :email="loggedUser.email" :size="40" :circle="true"></gravatar>
            </div>

            <div slot="dropdown-menu">
              <logged-user-dropdown :user="loggedUser"></logged-user-dropdown>
            </div>
          </dropdown>
        </div>
      </nav>
    </div>
  </section>
</template>

<script src="./navbar.js"></script>
<style lang="sass" src="./navbar.sass" scoped></style>
