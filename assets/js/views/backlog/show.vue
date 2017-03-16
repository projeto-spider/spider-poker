<template>
  <main>
    <hero-title
      v-if="project"
      :text="`${project.name} Backlog`"
    />

    <div class="container">
      <div class="columns">
        <div class="column is-6">
          <div v-for="story in stories">
            <story
              :name="story.name"
              :description="story.description"
              :editFunction="openEditModal(story)"
            >
              <div v-for="child in story.children">
                <story
                  :name="child.name"
                  :description="child.description"
                  :isChild="true"
                  :editFunction="openEditModal(child)"
                />
              </div>
            </story>
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
                @click="openAddModal"
              >
              <span class="icon is-small">
                <i class="fa fa-thumb-tack"></i>
              </span>
                <span> Add story </span>
              </button>
              </li>
              <br />
              <li>
                <div class="control is-grouped has-addons has-addons-centered">
                  <p class="control">
                    <input class="input" type="text" placeholder="Insert tool to import">
                    <button type="submit" class="button is-primary">
                      Import
                    </button>
                  </p>
                </div>
              </li>
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
import {HeroTitle, ErrorableInput} from 'app/components'
import Story from './story'
import {Stories, Projects} from 'app/api'
import {insertChangesetErrors} from 'app/utils'

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

function updateStory(id, name, description) {

}

export default {
  name: 'BacklogShowView',

  components: {HeroTitle, ErrorableInput, Story},

  data() {
    return {
      modal: emptyModal,

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

    //const projectName = this.$route.params.project

    //const {data: projs} = await Projects.show(projectName)
    const projs = [{
      name: 'lalala',
      displayName: 'lala'

    }]

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
    openAddModal() {
      this.modal = {
        ...emptyModal,
        open: true,
        new: true
      }
    },

    openEditModal(story) {
      return () => {
        this.modal = {
          ...emptyModal,
          ref: story,
          name: story.name,
          description: story.description,
          open: true,
          id: story.id
        }
      }
    },

    closeModal() {
      this.modal = emptyModal
    },

    submitModal() {
      if (this.modal.new) {
        this.addStory()
      } else {
        this.editStory()
      }
    },

    async addStory() {
      this.stories.push({
        name: this.modal.name,
        description: this.modal.description,
        children: []
      })
      this.closeModal()
    },

    editStory() {
      this.modal.ref = {
        ...this.modal.ref,
        name: this.modal.name,
        description: this.modal.description
      }
    },

    updateStory(id, name, description) {
      for (var i = 0; i < this.stories.length; i++) {
        if (this.stories[i].id === id) {
          this.stories[i] = {
            ...this.stories[i],
            name: this.modal.name,
            description: this.modal.description
          }
        }
      }
    },

 /*   async editStory() {
      if (this.status.stories === 'loading') {
        return
      }

      this.status.stories = 'loading'

      const id = storyIdView(this)

      const attributes = R.pipe(
        R.view(R.lensPath(['organization'])),
        R.pick(['displayName', 'description', 'location', 'url', 'private'])
      )(this)

      attributes.display_name = attributes['display-name']

      try {
        await Stories.update(id, attributes)

        this.status = 'success'

        this.errors = emptyErrors
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    }, */

    async deleteStory() {
      if (confirm('Are you sure you want to delete this storie?')) {
        const id = storyIdView(this)

        await Stories.delete(id)

        this.$router.push({name: 'ProjectsList'})
      }
    },

    async deletesubStorie() {
      if (confirm('Are you sure you want to delete this subStorie?')) {
        const stoId = storyIdView(this)

        const subStoId = subStoryIdView(this)

        await Stories.subStories.delete(stoId, subStoId)

        this.$router.push({name: 'BacklogShowView'})
      }
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
