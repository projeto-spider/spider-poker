<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close()">
          <i>keyboard_arrow_left</i>
        </button>

        Editing Organization
      </q-toolbar-title>
    </div>

    <div slot="header" class="toolbar bg-white">
      <q-select
        label="Select an Organization"
        class="full-width text-dark"
        type="list"
        v-model="organizationIndexOnList"
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
                  </div>
                </div>

                <hr>

                <div class="item multiple-lines">
                  <div class="item-content">
                    <div class="floating-label">
                      <input required class="full-width" v-model="form.display_name">
                      <label>Display Name</label>
                    </div>
                  </div>
                </div>

                <hr>

                <label class="item two-lines">
                  <div class="item-content has-secondary">
                    <div>Is this organization private?</div>
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
                    <button type="button" @click="confirmDeleteOrganization" class="negative">Delete</button>
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
                  <div>{{member.role === 'admin' ? 'Administer' : 'Member'}}</div>
                </div>

                <div class="item-secondary" v-show="member.user.id !== loggedUser.id">
                  <i slot="target">
                    more_vert
                    <q-popover ref="memberPopover">
                      <div class="list" @click="$refs.memberPopover[index].close()">
                        <template>
                          <div
                            v-if="member.role === 'admin'"
                            class="item item-link"
                            @click="updateRole(member, 'member')"
                          >
                            <div class="item-content">Revoke Admin</div>
                          </div>

                          <div v-else class="item item-link" @click="updateRole(member, 'admin')">
                            <div class="item-content">Grant Admin</div>
                          </div>
                        </template>

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

<script src="./edit-organization.js"></script>
