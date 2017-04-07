<template >
  <li :class="{open: open}" class="dropdown notifications-menu">
    <a href="#" data-toggle="dropdown" @click="open = !open" class="dropdown-toggle">
      <i class="fa fa-bell-o"></i>
        <span v-if="notifications.length > 0" class="label label-warning">{{notifications.length}}</span>
    </a>
    <ul class="dropdown-menu">
      <li class="header">You have {{notifications.length}} notification(s)</li>
      <li>
        <ul class="menu">
          <li v-for="notification in notifications">
            <a href="#" @click.prevent="check(notification.id)">{{notification.content}}</a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>

<script>
import R from 'ramda'
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
