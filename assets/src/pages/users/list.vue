<template>
  <div class="box">
    <div class="box-body table-responsive no-padding">
      <table class="table table-hover">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
          <tr v-for="user in users">
            <td>{{user.profile.name || user.username}}</td>
            <td>{{user.email}}</td>
            <td>
              <router-link :to="{name: 'user', params: {username: user.username}}" class="label label-success">View</router-link>
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
  import {Users} from 'app/api';

  export default {
    name: 'UsersListPage',

    created() {
      store.commit('page/set', {title: 'Users'});

      Users.all()
        .then(res => {
          this.users = res.data;
        });
    },

    data() {
      return {
        users: [],
      };
    },
  }
</script>
