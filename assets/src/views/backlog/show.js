import R from 'ramda'
import {mapGetters} from 'vuex'
import Draggable from 'vuedraggable'
import {HeroTitle, ErrorableInput} from 'app/components'
import Story from './story'
import {Stories, Projects} from 'app/api'

let idGenerator = 6

const projectIdView = R.view(R.lensPath(['project', 'id']))

const emptyEditorErrors = {
  name: [],
  description: []
}

const emptyEditorModal = {
  open: false,
  new: false,
  id: -1,
  parent: false,
  name: '',
  description: '',
  errors: emptyEditorErrors
}

const emptyMoveModal = {
  open: false,
  move: false,
  newPosition: -1
}

export default {
  name: 'BacklogShowView',

  components: {Draggable, HeroTitle, ErrorableInput, Story},

  data() {
    return {
      modal: {
        editor: emptyEditorModal,
        move: emptyMoveModal
      },

      status: {
        project: 'not-asked',
        backlog: 'not-asked'
      },

      project: null,
      db: {},
      backlog: []
    }
  },

  computed: {
    stories() {
      const idToStory = R.flip(R.prop)(this.db)

      return R.map(R.pipe(
        idToStory,
        R.evolve({children: R.map(idToStory)})
      ))(this.backlog)
    },

    ...mapGetters(['loggedUser'])
  },

  async created() {
    this.status.project = 'loading'

    const projectName = this.$route.params.project

    const {data: projs} = await Projects.show(projectName)

    if (projs.length === 0) {
      this.status.project = 'errored'
      return
    }

    this.status.project = 'success'

    this.project = projs[0]

    this.backlog = [1, 2, 3]

    this.db = {
      1: {
        id: 1,
        name: 'First',
        description: 'Lorem ipsum',
        children: [4, 5]
      },
      2: {
        id: 2,
        name: 'Second',
        description: 'Lorem ipsum',
        children: []
      },
      3: {
        id: 3,
        name: 'Third',
        description: 'Lorem ipsum',
        children: []
      },
      4: {
        id: 4,
        name: 'Child One',
        description: 'Lorem ipsum',
        children: []
      },
      5: {
        id: 5,
        name: 'Child Two',
        description: 'Lorem ipsum',
        children: []
      }
    }
  },

  methods: {
    openAddModal(parent = false) {
      this.modal.editor = {
        ...emptyEditorModal,
        open: true,
        new: true,
        parent
      }
    },

    openEditModal(id) {
      const {name, description} = this.db[id]

      this.modal.editor = {
        ...emptyEditorModal,
        open: true,
        description,
        name,
        id
      }
    },

    openMoveModal(index, parent = false){
      this.modal.move = {
        ...emptyMoveModal,
        open: true,
        newPosition: index + 1,
        index,
        parent
      }
    },

    closeModal(name) {
      this.modal[name].open = false
    },

    submitEditorForm() {
      (this.modal.editor.new ? this.addStory : this.editStory)()
    },

    addStory() {
      const parent  = this.modal.editor.parent

      const id = idGenerator++

      const story = {
        ...R.pick(['name', 'description'], this.modal.editor),
        children: [],
        id
      }

      this.db[id] = story

      if (parent) {
        this.db[parent].children.push(id)
      } else {
        this.backlog.push(id)
      }

      this.closeModal('editor')
    },

    editStory() {
      const {id, name, description} = this.modal.editor

      if (this.db[id]) {
        this.db[id] = {
          ...this.db[id],
          name,
          description
        }
      }

      this.closeModal('editor')
    },

    deleteStory(id, parent = false) {
      if (confirm('Are you sure you want to delete this story?')) {
        const matchId = R.compose(R.equals(id))

        if (!parent) {
          const index = this.backlog.findIndex(matchId)
          if (index !== -1) {
            this.backlog.splice(index, 1)
            delete this.db[id]
          }
        } else {
          const index = this.db[parent].children.findIndex(matchId)
          if (index !== -1) {
            const [deletedId] = this.db[parent].children.splice(index, 1)
            delete this.db[deletedId]
          }
        }
      }
    },

    move(direction, index, parent = false) {
      const doMove = (xs, index) => {
        const story = R.nth(index, xs)

        const nextIndex = R.pipe(
          R.ifElse(R.always(R.equals('up', direction)), R.dec, R.inc),
          R.clamp(0, xs.length)
        )(index)

        console.log('next', nextIndex, story, xs[index])

        return R.pipe(
          R.remove(index, 1),
          R.insert(nextIndex, story)
        )(xs)
      }

      if (!parent) {
        console.log(direction, index, parent)
        this.backlog = doMove(this.backlog, index)
      } else {
        this.db[parent].children = doMove(this.db[parent].children, index)
      }
    },

    moveTo() {
      const {index, parent = false, newPosition} = this.modal.move

      if (!parent) {
        const story = R.nth(index, this.backlog)
        const nextIndex = R.clamp(0, this.backlog.length, newPosition - 1)

        this.backlog = R.pipe(
          R.remove(index, 1),
          R.insert(nextIndex, story)
        )(this.backlog)
      } else {
        const story = R.nth(index, this.db[parent].children)
        const nextIndex = R.clamp(0, this.db[parent].children.length, newPosition - 1)

        this.db[parent].children = R.pipe(
          R.remove(index, 1),
          R.insert(nextIndex, story)
        )(this.db[parent].children)
      }

      this.closeModal('move')
    }
  }
}
