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
                  </form>
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

<script src="./show.js"></script>

<style scoped=true>
  small .fa {
    font-size: 14px;
    padding-top: 4px;
  }
</style>
