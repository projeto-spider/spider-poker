 <template>
  <div
    @click="selectProject(project.id)"
    class="item item-link"
    :class="{'two-lines': project.organization, 'active': selectedProject && project.id === selectedProject.id}"
  >
    <div class="item-content" :class="{'has-secondary': project.organization}">
      <div>{{project.name}}</div>
      <div>{{project.organization}}</div>
    </div>

    <div class="item-secondary">
      <i slot="target">
        more_vert
        <q-popover ref="popover">
          <div class="list">
            <div v-if="isManager" class="item item-link" @click="promptProjectEdit">
              <div class="item-content">Edit</div>
            </div>

            <div
              class="item item-link"
              @click="$refs.modal.open(), $refs.modalChild.sync(), $refs.popover.close()"
            >
              <div class="item-content">Members</div>
            </div>

            <div v-if="isManager" class="item item-link" @click="confirmDeleteProject">
              <div class="item-content">Delete</div>
            </div>

            <div v-if="!isManager" class="item item-link" @click="confirmLeaveProject">
              <div class="item-content">Leave</div>
            </div>
          </div>
        </q-popover>
      </i>
    </div>

    <q-modal ref="modal" content-classes="modal-edition">
      <project-members-modal
        ref="modalChild"
        :modal="$refs.modal"
        :project="project"
      ></project-members-modal>
    </q-modal>
  </div>
</template>

<script src="./project.js"></script>
