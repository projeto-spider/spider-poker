<template>
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
          <tr v-for="org in organizations">
            <td>{{org.display_name || org.name}}</td>
            <td>{{org.description || '-'}}</td>
            <td>{{org.private ? 'Yes' : 'No'}}</td>
            <td>
              <router-link
                :to="{name: 'organization', params: {id: org.name}}"
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
</template>

<script>
  import R from 'ramda';
  import store from 'app/store';
  import {Organizations} from 'app/api';

  export default {
    name: 'OrganizationsList',

    created() {
      store.commit('page/set', {title: 'Organizations'});
      Organizations.all()
        .then(({data}) => {
          this.organizations = data;
        });
    },

    data() {
      return {
        organizations: [],
      };
    },

    methods: {
    }
  }
</script>
