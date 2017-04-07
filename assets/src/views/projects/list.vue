<template>
  <main>
    <hero-title
      text="Projects list"
    />
    <div class="box">
      <div class="box-body table-responsive no-padding">
        <table class="table table-hover table is-striped">
          <tbody>
            <tr>
              <th><span class="tag is-spider is-medium">Name</span></th>
              <th><span class="tag is-spider is-medium">Description</span></th>
              <th><span class="tag is-spider is-medium">Type</span></th>
            </tr>
            <tr v-for="proj in projects ">
             <td>
                <router-link
                  :to="{name: 'projectShow', params: {project: proj.name}}"
                  class="label label-success"
                >
                  {{proj.displayName || proj.name}}
                </router-link>
              </td>
              <td>{{proj.description || '-'}}</td>
              <td>{{proj.private ? 'Private' : 'Public'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
  import {Projects, Organizations} from 'app/api'
  import {HeroTitle} from 'app/components'

  export default {
    name: 'projectsList',

    components: {HeroTitle},

    async created() {
      if (this.$route.name === 'organizationProjectsList') {
        const orgName = this.$route.params.organization
        const {data} = await Organizations.show(orgName)

        if (data.length === 0) {
          this.status = 'errored'
          return
        }

        const organization = data[0]

        const res = await Organizations.projects.all(organization.id)
        this.projects = res.data
      } else {
        const res = await Projects.all()
        this.projects = res.data
      }
    },

    data() {
      return {
        projects: [],
        status: 'not-asked'
      }
    },

    methods: {
    }
  }
</script>

<style lang="sass" scoped>
  .is-spider
    background-color: #1C336E
    color: white !important
</style>
