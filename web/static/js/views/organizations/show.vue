<template lang='pug'>
  div
    .row(v-if='organization !== null')
      .col-md-3
        .box.box-primary
          .box-body.box-profile
            h3.profile-username.text-center {{organization.display_name || organization.name}}
            p.text-muted.text-center {{organization.name}}
            ul.list-group.list-group-unbordered
              li.list-group-item
                b Projects
                a.pull-right {{projects.length}}
      .col-md-9
        .box
          .box-body.table-responsive.no-padding
            table.table.table-hover
              tbody
                tr
                  th Name
                  th Description
                  th Private
                  th Actions
                tr(v-for='proj in projects')
                  td {{proj.display_name || proj.name}}
                  td {{proj.description || '-'}}
                  td {{proj.private ? 'Yes' : 'No'}}
                  td
                    router-link(':to'='{name: "organization", params: {id: proj.name}}').label.label-success View
</template>

<script>
import {R} from 'app/utils';
import store from 'app/store';
import {Organizations} from 'app/api';

export default {
  name: 'OrganizationShow',

  created() {
    store.commit('page/set', {title: 'Organizations'});
    this.loadOrganization();
  },

  data() {
    return {
      organization: null,
      projects: [],
    };
  },

  methods: {
    loadOrganization() {
      Organizations.show(this.$route.params.id)
        .then(({data}) => {
          this.organization = data;

          return Organizations.projects.all(data.name);
        })
        .then(({data}) => {
          this.projects = data;
        })
        .catch(() => {
          this.$router.replace({name: 'error'})
        });
    },
  },
}
</script>
