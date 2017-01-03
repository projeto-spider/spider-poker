<template lang="pug">
  .wrapper
    header.main-header
      a.logo(href='#')
        span.logo-mini #[b P]Poker
        span.logo-lg #[b Planning]Poker

      nav.navbar.navbar-static-top(role="navigation")
        .navbar-custom-menu
          ul.nav.navbar-menu

    sidebar

    .content-wrapper(':style'='wrapperStyle')
      section.content-header
        h1 {{page.title}}
          small(v-if='page.description !== null') {{page.description}}
      section.content
        router-view.nested-child
    footer.main-footer
      .pull-right.hidden-xs
        | Anything you want
      strong
        | Copyright © 2016
        a(href='#') Company
        | .
      |  All rights reserved.
    aside.control-sidebar.control-sidebar-dark
      ul.nav.nav-tabs.nav-justified.control-sidebar-tabs
        li.active
          a(href='#', data-toggle='tab')
            i.fa.fa-home
        li
          a(href='#', data-toggle='tab')
            i.fa.fa-gears
      .tab-content
        #control-sidebar-home-tab.tab-pane.active
          h3.control-sidebar-heading Recent Activity
          ul.control-sidebar-menu
            li
              a(href='#')
                i.menu-icon.fa.fa-birthday-cake.bg-red
                .menu-info
                  h4.control-sidebar-subheading Langdon's Birthday
                  p Will be 23 on April 24th
          h3.control-sidebar-heading Tasks Progress
          ul.control-sidebar-menu
            li
              a(href='#')
                h4.control-sidebar-subheading
                  | Custom Template Design
                  span.pull-right-container
                    span.label.label-danger.pull-right 70%
                .progress.progress-xxs
                  .progress-bar.progress-bar-danger(style='{{width:')
        #control-sidebar-stats-tab.tab-pane Stats Tab Content
        #control-sidebar-settings-tab.tab-pane
          form(method='post')
            h3.control-sidebar-heading General Settings
            .form-group
              label.control-sidebar-subheading
                | Report panel usage
                input.pull-right(type='checkbox', checked='')
              p
                | Some information about this general settings option
    .control-sidebar-bg &nbsp;
</template>

<script>
  import {Sidebar} from 'app/components';

  export default {
    name: 'DashBoard',

    components: {
      sidebar: Sidebar,
    },

    computed: {
      page() {
        return this.$store.state.page;
      },
      wrapperStyle() {
        return {
          minHeight: `${window.innerHeight}px`
        }
      }
    },

    created() {
      this.$store.commit('page/set', {title: 'HomePage'});
    }
  }
</script>
