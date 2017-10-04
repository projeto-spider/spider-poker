import {Dialog, Toast} from 'quasar'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import axios from 'axios'

Vue.use(VueAnalytics, {
  id: window.GA_ID
})

export default {
  name: 'ImportFromRedmine',

  props: {
    currentProject: [Object, Boolean],
    importStories: Function
  },

  data: () => ({
    authenticated: false,
    projectList: false,
    issuesMenu: false,
    issuesList: false,
    projects: [],
    hostname: '',
    selected: {
      stories: []
    }
  }),

  computed: {
    selectedStories() {
      return this.selected.stories.length > 0
    }
  },

  methods: {
    askLoginInformations() {
      Dialog.create({
        title: 'Basic login',
        form: {
          url: {
            type: 'textbox',
            label: 'Url',
            model: ''
          },

          username: {
            type: 'textbox',
            label: 'Username',
            model: ''
          },

          password: {
            type: 'password',
            label: 'Password',
            model: ''
          },

          id: {
            type: 'textbox',
            label: 'Project identificator',
            model: ''
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Login',
            classes: 'positive',
            handler: this.basicProjectsLoad
          }
        ]
      })
    },

    askApiInformations() {
      Dialog.create({
        title: 'API authentication',
        form: {
          url: {
            type: 'textbox',
            label: 'Url',
            model: ''
          },

          key: {
            type: 'textbox',
            label: 'Api key',
            model: ''
          },

          id: {
            type: 'textbox',
            label: 'Project identificator',
            model: ''
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Login',
            classes: 'positive',
            handler: this.apiProjectsLoad
          }
        ]
      })
    },

    basicProjectsLoad({url, username, password, id}) {
      this.hostname = `https://cors-anywhere.herokuapp.com/` + url

      const projectUrl = this.hostname + `/projects/${id}/memberships.json`

      axios({
        method: 'get',
        baseURL: projectUrl,
        header: {Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`}
      })
      .then(this.handleSucess)
      .catch(this.handleFail)
    },

    apiProjectsLoad({url, key, id}) {
      this.hostname = `https://cors-anywhere.herokuapp.com/` + url

      const queryString = key !== '' ? `?key=${key}` : ''

      const projectsUrl = this.hostname + `/projects/${id}/memberships.json`

      axios.get(`${projectsUrl}${queryString}`)
        .then(this.handleSucess)
        .catch(this.handleFail)
    },

    handleSucess(response) {
      Toast.create.positive('Logged successfully')
      this.projects = response.data
      this.authenticated = true
      this.loadProjectIssues()
    },

    handleFail() {
      Toast.create.negative('Failed on loggin. Check your data')
    },

    handleMoreProjectsLoadedFail() {
      Toast.create.negative('Fail on load more projects')
    },

    loadProjectIssues() {
      const queryString = `?project_id=${this.projects.memberships[0].project.id}`

      const issuesUrl = this.hostname + '/issues.json'

      axios.get(`${issuesUrl}${queryString}`)
        .then(this.handleIssuesLoaded)
        .catch(this.handleIssuesLoadedFail)
    },

    handleIssuesLoaded(response) {
      this.issuesList = response.data.issues
      this.projectMenu = false
      this.issuesMenu = true
    },

    handleIssuesLoadedFail() {
      Toast.create.negative('Failed on load issues')
    },

    loadMoreIssues() {
      const queryString = `?project_id=${this.projects.memberships[0].project.id}&offset=${this.issuesList.length}`

      const issuesUrl = this.hostname + `/issues.json`

      axios.get(`${issuesUrl}${queryString}`)
        .then(this.handleMoreIssuesLoaded)
        .catch(this.handleMoreIssuesLoadedFail)
    },

    handleMoreIssuesLoaded(response) {
      if (response.data.total_count === this.issuesList.length) {
        Toast.create('All issues were loaded')
      }
      else {
        this.issuesList = this.issuesList.concat(response.data.issues)
      }
    },

    handleMoreIssuesLoadedFail() {
      Toast.create.negative('Failed on load more issues')
    },

    goBack() {
      if (this.issuesMenu) {
        this.issuesMenu = false
        this.issuesList = []
        this.authenticated = false
      }
    },

    selectAll() {
      this.selected.stories = this.issuesList
    },

    deselectAll() {
      this.selected.stories = []
    },

    doImport() {
      this.importStories(
        this.selected.stories
          .map(({subject: title, description}) => ({title, description, source: 1}))
      )
      this.$ga.event('Story', 'Imported', 'Imported from Redmine')
      this.selected.stories = []
    }
  }
}
