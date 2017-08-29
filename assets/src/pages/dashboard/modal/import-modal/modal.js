import ImportFromProject from './from-project.vue'
import ImportFromTrello from './from-trello.vue'
import ImportFromRedmine from './from-redmine.vue'

export default {
  name: 'ImportModal',

  components: {ImportFromProject, ImportFromTrello, ImportFromRedmine},

  props: {
    modal: Object,
    projects: Array,
    currentProject: [Object, Boolean],
    importStories: Function
  }
}
