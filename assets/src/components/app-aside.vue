<template>
  <div class="app-aside" :class="asideClass">
    <transition :name="transition">
      <div v-if="open" v-on-clickaway="toggle">
        <router-link :to="{name: 'home'}" class="app-aside-header">
          <span @click="toggle"><b>Planning</b>Poker</span>
        </router-link>

        <div class="app-aside-body">
          <nav class="app-aside-nav">
            <div class="app-aside-separator">Main</div>

            <ul @click="toggle" class="app-aside-menu">
              <router-link :to="{name: 'home'}" tag="li" exact>
                <a href="#">
                  <i class="fa fa-tachometer"></i>
                  <div>Dashboard</div>
                </a>
              </router-link>

              <router-link :to="{name: 'organizationsList'}" tag="li">
                <a href="#">
                  <i class="fa fa-users"></i>
                  <div>Organizations</div>
                </a>
              </router-link>

              <router-link :to="{name: 'projectsList'}" tag="li">
                <a href="#">
                  <i class="fa fa-book"></i>
                  <div>Projects</div>
                </a>
              </router-link>
            </ul>
          </nav>
        </div>

        <dropdown v-if="isAuthenticated">
          <footer class="app-aside-footer">
            <gravatar :email="loggedUser.email" :size="40" :circle="true"></gravatar>
            <div class="has-text-centered">
              <span>{{loggedUser.displayName}} <i class="fa fa-caret-up"></i></span>
            </div>
          </footer>

          <div slot="dropdown-menu">
            <logged-user-dropdown :user="loggedUser"></logged-user-dropdown>
          </div>
        </dropdown>
      </div>
    </transition>
  </div>
</template>

<script src="./app-aside.js"></script>
<style lang="sass" src="./app-aside.sass"></style>
