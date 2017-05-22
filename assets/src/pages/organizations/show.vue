<template>
  <main>
    <hero-title
      v-if='organization'
      :text="organization.displayName"
      :subtitle="`${organization.name}`"
    />

    <hero-title
      v-if="status.organization === 'errored'"
      text="Organization does not exist"
      color="danger"
    />

    <div v-if='organization' class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter has-text-centered">
          <p v-if="organization.description">{{organization.description}}</p>

          <div class="panel">
            <p v-if="organization.location" class="panel-block">
              <span class="panel-icon">
                <i class="fa fa-map-marker" />
              </span>
              {{organization.location}}
            </p>

            <p v-if="organization.url" class="panel-block">
              <span class="panel-icon">
                <i class="fa fa-globe" />
              </span>
              {{organization.url}}
            </p>


            <p class="panel-block">
              <span class="panel-icon">
                <i class="fa" />
              </span>
              {{organization.private ? 'Private' : 'Public'}}
            </p>
          </div>

          <div class="control is-grouped">
            <router-link
              v-if="isAdmin"
              :to="{name: 'organizationEdit', params: {organization: organization.name}}"
              class="button is-info is-outlined is-fullwidth"
            >
              <span class="icon is-small">
                <i class="fa fa-cog"></i>
              </span>

              <span>Edit organization</span>
            </router-link>

            <router-link
                v-if="isMember"
                :to="{name: 'projectCreate'}"
                class="button is-info is-outlined is-fullwidth"
              >
                <span class="icon is-small">
                  <i class="fa fa-bolt"></i>
                </span>

                <span>Start a new project</span>
              </router-link>

            <br />
              <router-link
                :to="{name: 'organizationProjectsList', params: {organization: organization.name}}"
                class="button is-info is-outlined is-fullwidth"
              >
                <span class="icon is-small">
                  <i class="fa fa-list"></i>
                </span>

                <span>Projects list</span>
              </router-link>
            </div>
          <br />
        </div>
      </div>
    </div>
    <br />
    <div v-if='organization' class="container">
      <div class="columns">
        <div class="column is-two-thirds is-offset-2 has-text-centered">
          <span class="tag is-spider is-medium is-centered">Members</span>

          <br />
          <br />

          <div class="panel">
            <div v-if="status.addMember === 'errored'" class="notification is-danger">
              <button @click="status.addMember = 'not-asked'" class="delete"></button>
              Something went wrong
            </div>

             <p v-if="isAdmin" class="control has-addons">
              <form @submit.prevent="submit" @keyup.13="submit">
                <p class="control has-addons">
                <input v-model="memberToAdd" type="text" class="input is-expanded" placeholder="Member name">
                <button class="button is-info" type="submit">
                  Add member
                </button>
                </p>
                <br />
              </form>
            </p>

            <article v-for="member in memberships" class="media">
              <router-link
                :to="{name: 'UserShow', params: {username: member.user.username}}"
              >
              </router-link>

              <div class="media-content">
                <p>
                  <router-link
                    :to="{name: 'UserShow', params: {username: member.user.username}}"
                  >
                    {{member.user.username}}
                  </router-link>
                  <p>
                    <router-link
                      :to="{name: 'UserShow', params: {username: member.user.username}}"
                      class="is-primary"
                    >
                      @{{member.user.username}}
                    </router-link>
                    <p>{{roleToText(member.role)}}</p>
                  </p>
                </p>
              </div>
              <p  v-if="member.user.id !== loggedUser.id" class="control has-addons has-addons-centered">
                <button v-if="isAdmin" @click="removeMember(member.user.id)" class="button is-danger">
                  Delete
                </button>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script src="./show.js"></script>

<style lang="sass" scoped>
  .is-spider
    background-color: #1C336E
    color: white !important
</style>
