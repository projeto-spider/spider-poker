<template lang="pug">
  aside.main-sidebar
    section.sidebar
      user-panel

      ul.sidebar-menu
        li.header MENU
        li.active
          a(href='#')
            i.fa.fa-link
            span Link
        router-link(tag='li', ':to'='{name: "organizations"}')
          a(href='#')
            i.fa.fa-link
            span Organizations
        li
          a(href='#')
            i.fa.fa-link
            span Another Link
        li.treeview
          a(href='#')
            i.fa.fa-link
            span Multilevel
            span.pull-right-container
              i.fa.fa-angle-left.pull-right
          ul.treeview-menu
            li
              a(href='#') Link in level 2
            li
              a(href='#') Link in level 2
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
