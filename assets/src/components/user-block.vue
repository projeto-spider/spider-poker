<template>
  <div class="user-block">
    <div class="user-body">
      <div class="user-avatar">
        <gravatar :email="user.email" :size="200" :circle="true"></gravatar>
        <h4 class="title is-4">{{user.displayName}}</h4>
        <h6 class="subtitle is-6">@{{user.username}}</h6>
      </div>

      <div class="content">
        <blockquote>{{user.bio}}</blockquote>
      </div>

      <ul class="user-infos">
        <li>
          <span>
            {{user.email}}
            <i class="fa fa-envelope-o is-pulled-right"></i>
          </span>
        </li>

        <li v-if="user.location">
          <span>
            {{user.location}}
            <i class="fa fa-map-marker is-pulled-right"></i>
          </span>
        </li>

        <li v-if="user.contact">
          <span>
            {{user.contact}}
            <i class="fa fa-phone is-pulled-right"></i>
          </span>
        </li>

        <li v-if="user.url">
          <span>
            <a :href="user.url" href="_blank">{{user.url}}</a>
            <i class="fa fa-magnet is-pulled-right"></i>
          </span>
        </li>

        <li v-if="user.bio">
          <span>
          </span>
        </li>
      </ul>
    </div>
    <div v-if="shouldRenderFooter" class="user-footer">
      <router-link :to="{name: 'userEdit'}" tag="button" class="button is-small is-primary">
        <span class="icon is-small"><i class="fa fa-pencil"></i></span>
        <span>Edit</span>
      </router-link>
    </div>
  </div>
</template>

<script src="./user-block.js"></script>
<style lang="sass" src="./user-block.sass" scoped></style>
