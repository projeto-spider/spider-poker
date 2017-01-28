<template lang='pug'>
  div
    .row(v-if='user !== null')
      .col-md-4.col-md-push-3
        .box.box-primary
          .box-body.box-profile
            h3.profile-username.text-center {{user.profile.name || user.username}}
            p.text-muted.text-center {{user.username}}
            ul.list-group.list-group-unbordered
              li.list-group-item
                b Email
                a.pull-right {{user.email}}

              li.list-group-item(v-if='user.profile.company')
                b Company
                a.pull-right {{user.profile.company}}

              li.list-group-item(v-if='user.profile.contact')
                b Contact
                a.pull-right {{user.profile.contact}}

              li.list-group-item(v-if='user.profile.location')
                b Location
                a.pull-right {{user.profile.location}}

              li.list-group-item(v-if='user.profile.url')
                b URL
                a.pull-right {{user.profile.url}}

              li.list-group-item(v-if='user.profile.bio')
                b Bio
                a.pull-right {{user.profile.bio}}
</template>

<script>
import {R} from 'app/utils';
import store from 'app/store';
import {Users} from 'app/api';

export default {
  name: 'UserShow',

  created() {
    store.commit('page/set', {title: 'Users'});
    this.loadUsers();
  },

  data() {
    return {
      user: null,
    };
  },

  methods: {
    loadUsers() {
      Users.show(this.$route.params.username)
        .then(({data}) => {
          this.user = data;
        })
        .catch(() => {
          this.$router.replace({name: 'error'})
        });
    },
  },
}
</script>
