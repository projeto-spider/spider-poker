import {Toast} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'ImportFromProject',

  props: {
    projects: Array,
    modal: Object,
    currentProject: {
      type: [Object, Boolean],
      default: false
    },
    importStories: Function
  },

  data: () => ({
    projectIndexOnList: false,
    stories: {},
    order: [],
    options: [],
    selected: {
      stories: []
    }
  }),

  computed: {
    selectOptions() {
      const id = this.currentProject.id

      this.options = this.projects.filter(function (proj) {
        return proj.id !== id
      })

      return this.options
        .map((proj, i) => ({
          label: proj.display_name || proj.name,
          value: i
        }))
    },

    backlog() {
      return this.order
        .map(id => Object.assign({
          children: this.stories[id].backlog.map(child => this.stories[child])
        }, this.stories[id]))
    },

    project() {
      if (this.projectIndexOnList === false) {
        return false
      }

      return this.options[this.projectIndexOnList]
    },

    selectedProject() {
      return !!this.project
    },

    selectedStories() {
      return this.selected.stories.length > 0
    }
  },

  //must watch modal's state to clean up the stories wich were charged
  watch: {
    'modal.active'() {
      this.closeModal()
    }
  },

  methods: {
    loadBacklog() {
      axios.get(`/projects/${this.project.id}/backlog`)
      .then(this.handleLoadedBacklog)
      .catch(this.handleLoadBacklogFail)
    },

    handleLoadedBacklog(response) {
      this.order = []
      this.selected.stories = []

      this.stories = response.data
      const order = response.meta.order.reverse()
      const interval = setInterval(() =>
      order.length
        ? this.order.push(order.pop())
        : clearInterval(interval)
    , 50)
    },

    handleLoadBacklogFail() {
      Toast.create.negative('Failed on load backlog')
    },

    closeModal() {
      if (this.modal.active === false) {
        this.projectIndexOnList = false
      }
    },

    selectAll() {
      this.selected.stories = this.backlog
    },

    deselectAll() {
      this.selected.stories = []
    },

    doImport() {
      if (this.selected.stories.length === 0) {
        Toast.create.negative('Please, select some story to be imported')
      }
      else {
        this.importStories(this.selected.stories)
      }
    }
  }
}
