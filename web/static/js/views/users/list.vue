<template lang="pug">
  .box
    .box-body.table-responsive.no-padding
      table.table.table-hover
        tbody
          tr
            th Name
            th Email
            th Actions
          tr(v-for='user in users')
            td {{user.profile.name || user.username}}
            td {{user.email}}
            td
              router-link(':to'='{name: "user", params: {username: user.username}}').label.label-success View
</template>

<script>
  import {R} from 'app/utils';
  import store from 'app/store';
  import {Users} from 'app/api';

  export default {
    name: 'UsersList',

    created() {
      store.commit('page/set', {title: 'Users'});

      Users.all()
        .then(({data}) => {
          this.users = data;
        });
    },

    data() {
      return {
        users: [],
      };
    },
  }
</script>
