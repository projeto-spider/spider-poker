<template lang="pug">
  aside.main-sidebar
    section.sidebar
      user-panel

      ul.sidebar-menu
        li.header MENU
        router-link(tag='li', ':to'='{name: "organizations"}')
          a(href='#')
            i.fa.fa-users
            span Organizations
</template>

<script>
  import SidebarUserPanel from './sidebar-user-panel';

  export default {
    name: 'Sidebar',

    components: {
      'user-panel': SidebarUserPanel,
    },
  }
</script>
