import {Toast} from 'quasar'

const trello = window.Trello

export default {
  name: 'ImportFromTrello',

  props: {
    currentProject: [Object, Boolean],
    importStories: Function
  },

  data: () => ({
    authorized: false,
    organizations: [],
    boards: [],
    backlogs: [],
    stories: [],
    boardsMenu: false,
    backlogsMenu: false,
    storiesMenu: false,
    selected: {
      stories: []
    }
  }),

  computed: {
    loadedBacklog() {
      return this.backlogs.length > 0
    },

    loadedStories() {
      return this.stories.length > 0
    },

    selectedStories() {
      return this.selected.stories.length > 0
    }
  },

  methods: {
    authorize() {
      trello.authorize({
        type: 'popup',
        name: 'Spider Poker',
        scope: {
          read: 'true'
        },
        expiration: 'never',
        success: () => {
          this.handleSucess()
        },
        error: () => {
          this.handleError()
        }
      })
    },

    handleSucess() {
      this.authorized = true

      trello.get('/members/me/organizations', data => {
        this.organizations = data
      })

      trello.get('members/me/boards', data => {
        this.boards = data
      })

      this.boardsMenu = true
    },

    handleError() {
      Toast.create.negative('Failed on login')
    },

    loadList(board) {
      trello.get(`boards/${board.id}/lists`, data => {
        this.backlogs = data
      })
      this.boardsMenu = false
      this.backlogsMenu = true
    },

    loadCards(list) {
      trello.get(`lists/${list.id}/cards`, data => {
        this.stories = data
      })

      this.backlogsMenu = false
      this.storiesMenu = true
    },

    goBack() {
      if (this.boardsMenu) {
        this.authorized = false
      }
      else if (this.backlogsMenu) {
        this.backlogsMenu = false
        this.boardsMenu = true
        this.backlogs = []
      }
      else if (this.storiesMenu) {
        this.storiesMenu = false
        this.backlogsMenu = true
        this.stories = []
        this.selected.stories = []
      }
    },

    selectAll() {
      this.selected.stories = this.stories
    },

    deselectAll() {
      this.selected.stories = []
    },

    doImport() {
      if (this.selected.stories.length === 0) {
        Toast.create.negative('Please, select a story to be imported')
      }
      else {
        this.importStories(
          this.selected.stories
            .map(({name: title, desc: description}) => ({title, description}))
        )
      }
    }
  }
}
