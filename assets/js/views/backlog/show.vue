<template>
  <main>
    <hero-title
      v-if="project"
      :text="`${project.displayName} Backlog`"
    />

    <div class="container">
      <div class="columns">
        <div class="column is-6">
          <draggable
            v-model="backlog"
            @start="drag=true"
            @end="drag=false"
          >
            <div v-for="(story, i) in stories">
              <story
                :name="story.name"
                :description="story.description"
                :editFunction="() => openEditModal(story.id)"
                :addFunction="() => openAddModal(story.id)"
                :deleteFunction="() => deleteStory(story.id)"
                :moveToFunction="() => openMoveModal(i)"
                :upFunction="() => move('up', i)"
                :downFunction="() => move('down', i)"
                :hideUp="i === 0"
                :hideDown="i === stories.length - 1"
              >
                <draggable
                  v-model="db[story.id].children"
                  @start="drag=true"
                  @end="drag=false"
                >
                  <div v-for="(child, j) in story.children">
                    <story
                      :name="child.name"
                      :description="child.description"
                      :isChild="true"
                      :moveToFunction="() => openMoveModal(j, story.id)"
                      :editFunction="() => openEditModal(child.id)"
                      :deleteFunction="() => deleteStory(child.id, story.id)"
                      :upFunction="() => move('up', j, story.id)"
                      :downFunction="() => move('down', j, story.id)"
                      :hideUp="j === 0"
                      :hideDown="j === story.children.length - 1"
                    />
                  </div>
                </draggable>
              </story>
            </div>
          </draggable>
        </div>

        <div v-if="modal.move.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Moving story</p>
                <button @click="() => closeModal('open')" class="delete"></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label">Current position: {{modal.move.index + 1}}</label>
                  <form
                    method="post"
                    @submit.prevent="moveTo"
                    @keyup.13="moveTo"
                  >
                    <p class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Move to..."
                        v-model="modal.move.newPosition"
                        autofocus
                      >
                    </p>
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="moveTo" class="button is-success">Move</a>
                <a @click="() => closeModal('move')" class="button">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="modal.editor.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p v-if="modal.editor.new" class="modal-card-title">Add story</p>
                <p v-else class="modal-card-title">Edit story</p>

                <button class="delete" @click="() => closeModal('editor')"></button>
              </header>
              <form
                method="post"
                @submit.prevent="submitEditorForm"
                @keyup.13="submitEditorForm"
              >
                <section class="modal-card-body">
                  <div class="container">
                    <errorable-input
                      v-model="modal.editor.name"
                      :errors="modal.editor.errors.name"
                      icon="bars"
                      placeholder="Story name"
                    />

                    <errorable-input
                      v-model="modal.editor.description"
                      type="textarea"
                      :errors="modal.editor.errors.description"
                      icon="id-card"
                      placeholder="Description"
                    />
                  </div>
                </section>
                <footer class="modal-card-foot">
                  <button v-if="modal.new" class="button is-success" type="submit">Create story</button>
                  <button
                    type="submit"
                    class="button is-success"
                  >
                    Done
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>

        <div class="column is-one-third is-offset-2">
          <aside class="menu">
            <ul class="menu-list">
              <li>
              <button
                class="button is-primary is-outlined is-fullwidth"
                @click="openAddModal()"
              >
                <span class="icon is-small">
                  <i class="fa fa-thumb-tack"></i>
                </span>
                <span> Add story </span>
              </button>
              </li>
              <br />
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import R from 'ramda'
import {mapState} from 'vuex'
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

    ...mapState({
      loggedinId: R.view(R.lensPath(['auth', 'user', 'id']))
    })
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

</script>

<style scoped=true>
  small .fa {
    font-size: 14px;
    padding-top: 4px;
  }
</style>
