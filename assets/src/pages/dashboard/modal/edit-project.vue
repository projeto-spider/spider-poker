<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close(closeModal)">
          <i>keyboard_arrow_left</i>
        </button>

        Editing Project
      </q-toolbar-title>
    </div>

    <div slot="header" class="toolbar bg-white">
      <q-select
        label="Select a Project"
        class="full-width text-dark"
        type="list"
        v-model="projectIndexOnList"
        :options="selectOptions"
        @input="selectedOrganization"
      ></q-select>
    </div>

    <div v-if="selected" class="layout-view">
      <div class="layout-padding">
        <template v-if="authorizing">
        </template>

        <template v-else-if="!authorized">
          <h6>You can not edit this entity</h6>
        </template>

        <template v-else>
          <div ref="tab-organization-edit">
            <form @submit.prevent="edit">
              <div class="list">
                <div class="item multiple-lines">
                  <div class="item-content">
                    <div class="floating-label">
                      <input required autofocus class="full-width" v-model="form.name">
                      <label>Name</label>
                    </div>
                    <ul>
                      <li v-for="error in errors.name" class="text-negative">
                        {{error}}
                      </li>
                    </ul>
                  </div>
                </div>

                <hr>

                <div class="item multiple-lines">
                  <div class="item-content">
                    <div class="floating-label">
                      <input required class="full-width" v-model="form.display_name">
                      <label>Display Name</label>
                    </div>
                    <ul>
                      <li v-for="error in errors.display_name" class="text-negative">
                        {{error}}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="item multiple-lines">
                  <div class="item-content">
                    <span class="item-label">Votation time (min): </span>
                    <q-numeric
                      v-model="form.votation_time"
                      :min="1"
                      :max="100"
                    >
                    </q-numeric>
                  </div>
                </div>

                <hr>

                <label class="item two-lines">
                  <div class="item-content has-secondary">
                    <div>Is this project private?</div>
                    <div>Visible only to members</div>
                  </div>

                  <div class="item-secondary">
                    <q-toggle v-model="form.private"></q-toggle>
                  </div>
                </label>

                <hr>

                <div class="item multiple-lines">
                  <div class="item-content">
                    <button type="submit" class="primary">Update</button>
                    <button type="button" @click="confirmDeleteProject" class="negative">Delete</button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div ref="tab-organization-members">
            <p>
              <q-autocomplete
                v-model="memberToAdd"
                :delay="0"
                @search="searchMembers"
                @selected="addMember"
              >
                <q-search v-model="memberToAdd"></q-search>
              </q-autocomplete>
            </p>

            <div class="list">
              <div v-for="(member, index) in members" :key="`org-member-${member.user_id}`" class="item two-lines">
                <gravatar :email="member.user.email" :circle="true" :size="48" class="item-primary"></gravatar>

                <div class="item-content has-secondary">
                  <div>{{member.user.display_name}}</div>

                  <template>
                    <div v-if="member.role === 'po'">
                      <i>person</i> Product Owner
                    </div>

                    <div v-else-if="member.role === 'manager'">
                      <i>person_outline</i> Manager
                    </div>

                    <div v-else>
                      <i>group</i> Team Member
                    </div>
                  </template>
                </div>

                <div class="item-secondary" v-show="member.user.id !== loggedUser.id">
                  <i slot="target">
                    more_vert
                    <q-popover ref="memberPopover">
                      <div class="list" @click="$refs.memberPopover[index].close()">
                        <div v-if="hasPo === 0">
                          <div
                            v-if="member.role !== 'po'"
                            class="item item-link"
                            @click="updateRole(member, 'po')"
                          >
                            <div class="item-content">Grant Product Owner</div>
                          </div>
                        </div>

                        <div
                          v-if="member.role !== 'team'"
                          class="item item-link"
                          @click="updateRole(member, 'team')"
                        >
                          <div class="item-content">Grant Team Member</div>
                        </div>

                        <div class="item item-link" @click="removeMember(member, index)">
                          <div class="item-content">Remove</div>
                        </div>
                      </div>
                    </q-popover>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="authorized" slot="footer" class="toolbar">
      <q-tabs
        :refs="$refs"
        default-tab="tab-organization-edit"
      >
        <q-tab name="tab-organization-edit" icon="edit">
          Edit
        </q-tab>
        <q-tab name="tab-organization-members" icon="group">
          Members
        </q-tab>
      </q-tabs>
    </div>
  </q-layout>
</template>

<script src="./edit-project.js"></script>
