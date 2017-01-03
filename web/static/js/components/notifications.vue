<template lang='pug'>
  li.dropdown.notifications-menu(':class'='{open: open}')
    a.dropdown-toggle(href='#', data-toggle='dropdown', '@click'='open = !open')
      i.fa.fa-bell-o
      span.label.label-warning(v-if='notifications.length > 0') {{notifications.length}}
    ul.dropdown-menu
      li.header You have {{notifications.length}} notification(s)
      li
        // inner menu: contains the actual data
        ul.menu
          li(v-for='notification in notifications')
            a(href='#', '@click.prevent'='check(notification.id)') {{notification.content}}
</template>

<script>
import {R} from 'app/utils';
import {Users} from 'app/api';
import {mapState} from 'vuex';

const userView = R.view(R.lensPath(['auth', 'user']));

export default {
  name: 'Notifications',

  created() {
    this.loadNotifications();
    this.interval = setInterval(this.loadNotifications, 10000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  data() {
    return {
      interval: null,
      open: false,
      notifications: [],
    };
  },

  computed: mapState({
    loggedin: R.pipe(
      userView,
      R.isNil,
      R.not
    ),
  }),

  methods: {
    loadNotifications() {
      if (this.loggedin && !this.open) {
        const username = userView(this.$store.state).username;

        Users.notifications.all(username)
          .then(({data}) => {
            this.notifications = data;
          })
          .catch(console.error);
      }
    },

    check(id) {
      this.notifications = this.notifications
        .filter((notification) => notification.id !== id)

      const username = userView(this.$store.state).username;

      Users.notifications.update(username, id, {read: true});
    },
  },
}
</script>
