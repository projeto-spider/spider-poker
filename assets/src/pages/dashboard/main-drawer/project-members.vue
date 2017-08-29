<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close()">
          <i>keyboard_arrow_left</i>
        </button>
        Members
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <div class="layout-padding">
        <p v-if="loggedUserIsManager">
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
          <div v-for="(member, index) in members" :key="member" class="item two-lines">
            <avatar :user="member" :circle="true" :size="48" class="item-primary"></avatar>

            <div class="item-content has-secondary">
              <div>{{member.name}}</div>

              <template>
                <div v-if="isPo(member)">
                  <i>person</i> Product Owner
                </div>

                <div v-else-if="isManager(member)">
                  <i>person_outline</i> Manager
                </div>

                <div v-else>
                  <i>group</i> Team Member
                </div>
              </template>
            </div>

            <div class="item-secondary" v-if="loggedUserIsManager && member.id !== loggedUser.id">
              <i slot="target">
                more_vert

                <q-popover ref="popover">
                  <div class="list" @click="$refs.popover[index].close()">
                    <div>
                      <div
                        v-if="!isPo(member) && !isManager(member)"
                        class="item item-link"
                        @click="updateRole(member, 'po')"
                      >
                        <div class="item-content">Grant Product Owner</div>
                      </div>
                    </div>

                    <div>
                      <div
                        v-if="!isPo(member) && !isManager(member)"
                        class="item item-link"
                        @click="updateRole(member, 'manager')"
                      >
                        <div class="item-content">Grant Manager</div>
                      </div>
                    </div>

                    <div
                      v-if="isPo(member)"
                      class="item item-link"
                      @click="revokeRole(member, 'po')"
                    >
                      <div class="item-content">Revoke PO</div>
                    </div>

                    <div class="item item-link" @click="removeMember(member)">
                      <div class="item-content">Remove</div>
                    </div>
                  </div>
                </q-popover>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script src="./project-members.js"></script>
