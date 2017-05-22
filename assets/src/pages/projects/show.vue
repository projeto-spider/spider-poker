<template>
  <main>
    <hero-title
      v-if='project'
      :text="project.displayName"
      :subtitle="`${project.name}`"
    />

    <hero-title
      v-if="status.project === 'errored'"
      text="Project does not exist"
      color="danger"
    />

    <div v-if='project' class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter has-text-centered">
          <p v-if="project.description">{{project.description}}</p>

          <div class="panel">

            <p class="panel-block">
              <span class="panel-icon">
                <i class="fa" />
              </span>
              {{project.private ? 'Private' : 'Public'}}
            </p>
          </div>
          <div class="control is-grouped">
            <router-link
              :to="{name: 'projectEdit', params: {project: project.name}}"
              class="button is-info is-outlined is-fullwidth"
            >
              <span class="icon is-small">
                <i class="fa fa-cog"></i>
              </span>

              <span>Edit project</span>
            </router-link>

            <router-link
              :to="{name: 'backlogShow'}"
              class="button is-info is-outlined is-fullwidth"
            >
              <span class="icon is-small">
                <i class="fa fa-bolt"></i>
              </span>

              <span>Backlog</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div v-if='project' class="container">
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

            <p v-if="isManager" class="control has-addons">
              <form @submit.prevent="submit" @keyup.13="submit">
                <p class="control has-addons">
                  <span class="select">
                    <select v-model="memberToAddRole">
                      <option value="team">Team</option>
                      <option v-if="hasPo === 0" value="po">Product owner</option>
                    </select>
                  </span>
                <input v-model="memberToAdd" type="text" class="input is-expanded" placeholder="Member name">
                <button class="button is-info" type="submit">
                  Add member
                </button>
                </p>
              </form>
            </p>

            <br />

            <article v-for="member in memberships" class="media">
              <router-link
                :to="{name: 'UserShowView', params: {username: member.user.username}}"
              >
              </router-link>

              <div class="media-content">
                <p>
                  <router-link
                    :to="{name: 'UserShowView', params: {username: member.user.username}}"
                  >
                    {{member.user.profile.name}}
                  </router-link>
                  <p>
                    <router-link
                      :to="{name: 'UserShowView', params: {username: member.user.username}}"
                      class="is-primary"
                    >
                      @{{member.user.username}}
                    </router-link>
                    <p>{{roleToText(member.role)}}</p>
                  </p>
                </p>
              </div>
              <p  v-if="member.user.id !== loggedUser.id" class="control has-addons has-addons-centered">
                <button v-if="isManager" @click="removeMember(member.user.id)" class="button is-danger">
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
