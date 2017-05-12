<template>
  <main>
    <hero-title
      text="Organization list"
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
            <tr v-for="org in organizations ">
              <td>
                <router-link
                  :to="{name: 'organizationShow', params: {organization: org.name}}"
                  class="label label-success"
                >
                  {{org.displayName || org.name}}
                </router-link>
              </td>
              <td>{{org.description || '-'}}</td>
              <td>{{org.private ? 'Private' : 'Public'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
  import {Organizations} from 'app/api'
  import {HeroTitle} from 'app/components'

  export default {
    name: 'OrganizationsList',

    components: {HeroTitle},

    created() {
      Organizations.all()
        .then(res => {
          this.organizations = res.data
        })
    },

    data() {
      return {
        organizations: []
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
