<template>
  <div class="memberships-block">
    <div class="memberships-body">
      <article v-for="org in organizations" class="media">
        <div class="media-content">
          <div class="content">
            <div class="icon is-small">
              <i class="fa fa-group" />&nbsp;
            </div>
            <strong>
              <router-link
              :to="{name: 'organizationShow', params: {organization: org.name}}"
              class="is-spider"
              >
                {{org.displayName || org.name}}
              </router-link>
            </strong>
            <p class="description">{{org.description}}</p>
          </div>

          <article v-for="proj in projects.filter(p => p.organizationId === org.id)" class="media">
            <figure class="media-left"><p class="image is-48x48"></p></figure>

            <div class="media-content">
              <div class="icon is-small">
                <i class="fa fa-list-alt" />&nbsp;
              </div>
              <strong>
                <router-link
                :to="{name: 'projectShow', params: {project: proj.name}}"
                >{{proj.displayName}}
                </router-link>
              </strong>
              <p class="description">{{proj.description}}</p>
            </div>
          </article>
        </div>
      </article>
    </div>
  </div>
</template>

<script src="./memberships-block.js"></script>

<style lang="sass" src="./memberships-block.sass"></style>
