<template>
  <div>
    <div v-if="organization !== null" class="row">
      <div class="col-md-3">
        <div class="box box-primary">
          <div class="box-body box-profile">
            <h3 class="profile-username text-center">{{organization.display_name || organization.name}}</h3>
            <p class="text-muted text-center">{{organization.name}}</p>
            <ul class="list-group list-group-unbordered">
              <li class="list-group-item"><b>Projects</b><a class="pull-right">{{projects.length}}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="box">
          <div class="box-body table-responsive no-padding">
            <table class="table table-hover">
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Private</th>
                  <th>Actions</th>
                </tr>
                <tr v-for="proj in projects">
                  <td>{{proj.display_name || proj.name}}</td>
                  <td>{{proj.description || '-'}}</td>
                  <td>{{proj.private ? 'Yes' : 'No'}}</td>
                  <td>
                    <router-link
                      :to="{name: 'organization', params: {id: proj.name}}"
                      class="label label-success"
                    >
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {R} from 'app/utils';
import store from 'app/store';
import {Organizations} from 'app/api';

export default {
  name: 'OrganizationShow',

  created() {
    store.commit('page/set', {title: 'Organizations'});
    this.loadOrganization();
  },

  data() {
    return {
      organization: null,
      projects: [],
    };
  },

  methods: {
    loadOrganization() {
      Organizations.show(this.$route.params.id)
        .then(({data}) => {
          this.organization = data;

          return Organizations.projects.all(data.name);
        })
        .then(({data}) => {
          this.projects = data;
        })
        .catch(() => {
          this.$router.replace({name: 'error'})
        });
    },
  },
}
</script>
