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
    options: [],
    backlog: [],
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
          label: proj.name,
          value: i
        }))
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

      this.backlog = response.data
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
      this.importStories(this.selected.stories)
      this.selected.stories = []
    }
  }
}
