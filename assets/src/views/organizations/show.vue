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
                :to="{name: 'userShow', params: {username: member.user.username}}"
              >
              </router-link>

              <div class="media-content">
                <p>
                  <router-link
                    :to="{name: 'userShow', params: {username: member.user.username}}"
                  >
                    {{member.user.name}}
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

<script>
import {mapState} from 'vuex'
import R from 'ramda'
import {HeroTitle} from 'app/components'
import {Organizations, Users} from 'app/api'

export default {
  name: 'OrganizationShowView',

  components: {HeroTitle},

  data() {
    return {
      memberships: [],

      status: {
        organization: 'not-asked',
        members: 'not-asked',
        addMember: 'not-asked'
      },

      memberToAdd: '',
      organization: null,
      projects: []
    }
  },

  computed: {
    ...mapState({
      loggedinId: R.view(R.lensPath(['auth', 'user', 'id']))
    }),

    isAdmin() {
      if (!this.loggedinId) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.role === 'admin' && member.user.id === this.loggedinId)
        .length
    },

    isMember() {
      if (!this.loggedinId) {
        return false
      }

      if (this.memberships.length === 0) {
        return false
      }

      return !!this.memberships
        .filter(member => member.user.id === this.loggedinId)
        .length
    }
  },

  async created() {
    this.status.organization = 'loading'

    const res = await Organizations.show(this.$route.params.organization)

    if (res.data.length === 0) {
      this.status.organization = 'errored'
      return
    }

    this.status.organization = 'success'

    this.organization = res.data[0]

    this.status.members = 'loading'

    const resMemberships = await Organizations.members.all(this.organization.id)

    this.memberships = resMemberships.data

    this.status.members = 'success'
  },

  methods: {
    roleToText(role) {
      switch (role) {
        case 'admin':
          return 'Adiminister'

        default:
          return 'Member'
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

      const orgId = R.prop('id', this.organization)

      try {
        const resNewMember = await Organizations.members.create(orgId, userId, 'member')

        this.memberships.push(resNewMember.data)

        this.status.addMember = 'success'

        this.memberToAdd = ''
      } catch (res) {
        this.status.addMember = 'errored'
      }
    },

    async removeMember(userId) {
      if (confirm('Are you sure you want to remove this member?')) {
        const orgId = this.organization.id

        await Organizations.members.delete(orgId, userId)

        this.memberships = this.memberships
        .filter(member => member.user.id !== userId)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  .is-spider
    background-color: #1C336E
    color: white !important
</style>
