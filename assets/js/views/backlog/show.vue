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
            v-model="stories" 
            :options="{group:'people'}" 
            @start="drag=true" 
            @end="drag=false"
          >
            <div v-for="(story, i) in stories">
              <story
                :name="story.name"
                :description="story.description"
                :editFunction="openEditModal(story, i)"
                :addFunction="openAddModal(i)"
                :moveToFunction="openMoveModal(i)"
                :deleteFunction="deleteStory(i)"
                :upFunction="move('up', i)"
                :downFunction="move('down', i)"
                :hideUp="i === 0"
                :hideDown="i === stories.length - 1"
              >
                <div v-for="(child, j) in story.children">
                  <story
                    :name="child.name"
                    :description="child.description"
                    :isChild="true"
                    :moveToFunction="openMoveModal(i, j)"
                    :editFunction="openEditModal(child, i, j)"
                    :deleteFunction="deleteStory(i, j)"
                    :upFunction="move('up', i, j)"
                    :downFunction="move('down', i, j)"
                    :hideUp="j === 0"
                    :hideDown="j === story.children.length - 1"
                  />
                </div>
              </story>
            </div>
          </draggable>
        </div>

        <div v-if="moveModal.move">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Moving story</p>
                <button  @click="moveModal.move = false" class="delete"></button>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <label class="label">Current position: {{moveModal.index}}</label>
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
                        v-model="moveModal.newPosition"
                      >
                    </p>
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="moveTo" class="button is-success">Move</a>
                <a @click="moveModal.move = false" class="button">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="modal.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Add story</p>
                <button class="delete" @click="closeModal"></button>
              </header>
              <form
                method="post"
                @submit.prevent="submitModal"
                @keyup.13="submitModal"
              >
                <section class="modal-card-body">
                  <div class="container">
                    <errorable-input
                      v-model="modal.name"
                      :errors="modal.errors.name"
                      icon="bars"
                      placeholder="Story name"
                    />

                    <errorable-input
                      v-model="modal.description"
                      type="textarea"
                      :errors="modal.errors.description"
                      icon="id-card"
                      placeholder="Description"
                    />
                  </div>
                </section>
                <footer class="modal-card-foot">
                  <button v-if="modal.new" class="button is-success" type="submit">Create story</button>
                  <button
                    v-if="modal.new == false"
                    class="button is-success"
                    @click="editStory"
                  >
                    Edit story
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
                @click="openEmptyModal"
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
import draggable from 'vuedraggable'
import {HeroTitle, ErrorableInput} from 'app/components'
import Story from './story'
import {Stories, Projects} from 'app/api'

const projectIdView = R.view(R.lensPath(['project', 'id']))

const emptyErrors = {
  name: [],
  description: []
}

const emptyModal = {
  id: false,
  open: false,
  new: false,
  name: '',
  description: '',
  errors: emptyErrors
}

const emptymoveModal = {
  move: false,
  newPosition: null
}

export default {
  name: 'BacklogShowView',

  components: {draggable, HeroTitle, ErrorableInput, Story},

  data() {
    return {
      modal: emptyModal,
      moveModal: emptymoveModal,

      status: {
        project: 'not-asked',
        story: 'not-asked',
        subStory: 'not-asked'
      },

      project: null,
      stories: [],
      subStories: []
    }
  },

  computed: {
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

    this.stories = [
      {
        id: 1,
        name: 'lalala',
        description: 'lala',
        children: [
          {
            name: 'lalala',
            description: 'lala'
          },
          {
            name: 'la'
          }
        ]
      },
      {
        id: 2,
        name: 'la',
        children: []
      },
      {
        id: 23,
        name: 'Xd',
        children: []
      }
    ]
  },

  methods: {
    openEmptyModal() {
      return this.openAddModal()()
    },

    openAddModal(parent = false) {
      return () => {
        this.modal = {
          ...emptyModal,
          parent,
          open: true,
          new: true
        }
      }
    },

    openEditModal({name, description, id}, index, child = false) {
      return () => {
        this.modal = {
          ...emptyModal,
          id,
          name,
          index,
          child,
          description,
          open: true
        }
      }
    },

    openMoveModal(index, child = false){
      return() => {
        this.moveModal ={
          ...emptymoveModal,
          move: true,
          index,
          child
        }
      }
    },

    closeModal() {
      this.modal = emptyModal
    },

    closeMoveModal() {
      this.moveModal = emptymoveModal
    },

    submitModal() {
      if (this.modal.new) {
        this.addStory()
      } else {
        this.editStory()
      }
    },

    addStory() {
      const parent = this.modal.parent

      const story = {
        name: this.modal.name,
        description: this.modal.description,
        children: []
      }

      if (parent !== false) {
        this.stories[parent].children.push(story)
      } else {
        this.stories.push(story)
      }

      this.closeModal()
    },

    editStory() {
      const {name, description, index, child = false} = this.modal

      if (child !== false) {
        this.stories[index].children[child] =
          this.updateStory(this.stories[index].children[child], name, description)
      } else {
        this.stories[index] =
          this.updateStory(this.stories[index], name, description)
      }

      this.closeModal()
    },

    updateStory(current, name, description) {
      return {
        ...current,
        name,
        description
      }
    },

    deleteStory(index, child = false) {
      return () => {
        if (confirm('Are you sure you want to delete this story?')) {
          if (child !== false) {
            this.stories[index].children =
              R.remove(child, 1, this.stories[index].children)
          } else {
            this.stories =
              R.remove(index, 1, this.stories)
          }
        }
      }
    },

    move(direction, index, child = false) {
      return () => {
        const doMove = (xs, index) => {
          const story = R.nth(index, xs)

          const nextIndex = R.compose(
            R.clamp(0, xs.length),
            R.ifElse(R.always(R.equals('up', direction)), R.dec, R.inc),
          )(index)

          return R.compose(
            R.insert(nextIndex, story),
            R.remove(index, 1)
          )(xs)
        }

        if (child !== false) {
          this.stories[index].children =
            doMove(this.stories[index].children, child)
        } else {
          this.stories = doMove(this.stories, index)
        }
      }
    },

    moveTo() {
      const {index, child = false} = this.moveModal
      R.clamp(0, this.stories.length, this.moveModal.newPosition)

      if (child !== false) {
        var obejctToMove = this.stories[index].child[this.moveModal.child]

        this.stories[this.moveModal.index].child.splice(this.moveModal.index, 1),
        this.stories[this.moveModal.index].child.splice(this.moveModal.newPosition,0,obejctToMove)
      } else {
        var obejctToMove = this.stories[this.moveModal.index]

        this.stories.splice(this.moveModal.index, 1),
        this.stories.splice(this.moveModal.newPosition,0,obejctToMove)
      }

      this.closeMoveModal()
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
