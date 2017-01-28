<template lang="pug">
  .box
    .box-body.table-responsive.no-padding
      table.table.table-hover
        tbody
          tr
            th Name
            th Description
            th Private
            th Actions
          tr(v-for='org in organizations')
            td {{org.display_name || org.name}}
            td {{org.description || '-'}}
            td {{org.private ? 'Yes' : 'No'}}
            td
              router-link(':to'='{name: "organization", params: {id: org.name}}').label.label-success View
</template>

<script>
  import {R} from 'app/utils';
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
