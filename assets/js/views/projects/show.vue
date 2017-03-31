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
                :to="{name: 'userShow', params: {username: member.user.username}}"
              >
              </router-link>

              <div class="media-content">
                <p>
                  <router-link
                    :to="{name: 'userShow', params: {username: member.user.username}}"
                  >
                    {{member.user.profile.name}}
                  </router-link>
                  <p>
                    <router-link
                      :to="{name: 'userShow', params: {username: member.user.username}}"
                      class="is-primary"
                    >
                      @{{member.user.username}}
                    </router-link>
                    <p>{{roleToText(member.role)}}</p>
                  </p>
                </p>
              </div>
              <p  v-if="member.user.id !== loggedinId" class="control has-addons has-addons-centered">
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

<script>
import R from 'ramda'
import {mapState} from 'vuex'
import {HeroTitle} from 'app/components'
import {Projects, Users} from 'app/api'

export default {
  name: 'ProjectShowView',

  components: {HeroTitle},

  data() {
    return {
      memberships: [],

      status: {
        project: 'not-asked',
        members: 'not-asked',
        addMember: 'not-asked'
      },

      memberToAdd: '',
      memberToAddRole: 'team',
      project: null
    }
  },

  computed: {
    ...mapState({
      loggedinId: R.view(R.lensPath(['auth', 'user', 'id']))
    }),

    isManager() {
      if (!this.loggedinId) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.role === 'manager' && member.user.id === this.loggedinId)
        .length
    },

    hasPo() {
      return this.memberships
        .filter(member => member.role === 'po')
        .length
    }
  },

  async created() {
    this.status.project = 'loading'

    const projectName = this.$route.params.project

    const {data: projs} = await Projects.show(projectName)

    if (projs.length === 0) {
      this.status.project = 'errored'
      return
    }

    this.status.project = 'success'

    this.project = projs[0]

    this.status.members = 'loading'

    const {data: memberships} = await Projects.members.all(this.project.id)

    this.memberships = memberships

    this.status.members = 'success'
  },

  methods: {
    roleToText(role) {
      switch (role) {
        case 'po':
          return 'Product owner'

        case 'manager':
          return 'Manager'

        default:
          return 'Team member'
      }
    },

    async submit() {
      if (this.status.addMember === 'loading') {
        return
      }

      this.status.addMember = 'loading'

      const res = await Users.show(this.memberToAdd)

      if (res.data.length === 0) {
        this.status.addMember = 'errored'
        return
      }

      const userId = R.prop('id', res.data[0])

      const projId = R.prop('id', this.project)

      const role = R.prop('memberToAddRole', this)
      try {
        const resNewMember = await Projects.members.create(projId, userId, role)

        this.memberships.push(resNewMember.data)

        this.status.addMember = 'success'

        this.memberToAdd = ''
        this.memberToAddRole = 'team'
      } catch (res) {
        this.status.addMember = 'errored'
      }
    },

    async removeMember(userId) {
      if (confirm('Are you sure you want to remove this member?')) {
        const projId = this.project.id

        await Projects.members.delete(projId, userId)

        this.memberships = this.memberships
        .filter(member => member.user.id !== userId)
      }
    }
  }
}
</script>
