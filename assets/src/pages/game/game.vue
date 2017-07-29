<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>

      <img src="../../assets/logo-mini.png">

      <q-toolbar-title :padding="1">
        Spider Poker
      </q-toolbar-title>

      <button @click="tryFullScreen">
        <i>fullscreen</i>
      </button>

      <button class="hide-on-drawer-visible" @click="$refs.rightDrawer.open()">
        <i>menu</i>
      </button>
    </div>

    <q-tabs :refs="$refs" default-tab="tab-chat" slot="navigation">
      <q-tab icon="chat" name="tab-chat">Chat</q-tab>
      <q-tab icon="list" name="tab-stories">Stories</q-tab>
      <q-tab icon="timeline" name="tab-events">Events</q-tab>
      <div
        v-if="role === 'manager' && current_story && (created || idle || discussion)"
        @click.prevent="startVoting"
        class="q-tab tab-control items-centter justify-center"
      >
        <i class="q-tabs-icon">star_rate</i>
        <span class="q-tab-label">Start Voting</span>
      </div>
      <div
        v-if="role === 'manager' && voting"
        @click.prevent="stopVoting"
        class="q-tab tab-control items-centter justify-center"
      >
        <i class="q-tabs-icon">star_rate</i>
        <span class="q-tab-label">Stop Voting</span>
      </div>
      <div
        v-if="role === 'manager'"
        @click.prevent="finishGame"
        class="q-tab tab-control items-centter justify-center"
      >
        <i class="q-tabs-icon">close</i>
        <span class="q-tab-label">Finish Game</span>
      </div>
    </q-tabs>

    <q-drawer ref="leftDrawer">
      <timer
        :state="state"
        :time="time"
      ></timer>

      <div class="list no-border platform-delimiter">
        <div
          class="item item-link"
          @click="anonymous = !anonymous"
        >
          <i class="item-primary">security</i>

          <div class="item-content">
            {{anonymous ? 'Disable' : 'Enable'}} Anonymous Chat
          </div>
        </div>

        <div
          class="item item-link"
          @click="downloadChat"
        >
          <i class="item-primary">file_download</i>

          <div class="item-content">
            Download Chat
          </div>
        </div>

        <div
          class="item item-link"
          @click="clearChat"
        >
          <i class="item-primary">delete</i>

          <div class="item-content">
            Clear Chat
          </div>
        </div>
      </div>

      <div v-if="users" class="list no-border platform-delimiter">
        <user-presence
          :online="online"
          :offline="offline"
          :state="state"
          :votes="votes"
          :voting="voting"
          :discussion="discussion"
        >
        </user-presence>
      </div>
    </q-drawer>

    <div ref="layout-view" class="layout-view">
      <div ref="layout-padding" class="layout-padding">
        <div ref="tab-chat" class="tab-chat">
          <transition-group name="user-presence">
            <message
              v-for="message in messages"
              :key="message"
              :message="message"
              :user="users[message.user_id]"
            >
            </message>
          </transition-group>
        </div>

        <div ref="tab-stories">
          <template v-for="(story, position) in backlog">
            <div v-if="story">
              <game-story
                :story="story"
                :isChild="false"
                :selectStory="() => selectStory(story)"
                :role="role"
                :voting="voting"
                :discussion="discussion"
                :currentStory="current_story"
              >
              </game-story>
            </div>

            <game-story
              :story="child"
              :isChild="true"
              :selectStory="() => selectStory(child)"
              :role="role"
              :voting="voting"
              :discussion="discussion"
              v-for="child in story.children"
              :key="child"
              v-if="child"
            >
            </game-story>
          </template>
        </div>

        <div ref="tab-events">
          <events
            v-for="ev in events"
            :key="ev"
            :event="ev"
            :story="stories[ev.story_id]"
          ></events>
        </div>
      </div>
    </div>

    <q-drawer ref="rightDrawer" v-if="stories[current_story]" right-side>
      <votation-drawer
        :selectedStory="stories[current_story]"
        :voting="voting"
        :discussion="discussion"
        :selectedCard="selectedCard"
        :order="order"
        :current_story="current_story"
        :role="role"
        :selectCard="selectCard"
        :substories="substories"
        :createSubstories="createSubstories"
      ></votation-drawer>
    </q-drawer>

    <div slot="footer" class="toolbar">
      <message-input
        :sendMessage="sendMessage"
      ></message-input>
    </div>
  </q-layout>
</template>

<script src="./game.js"></script>
<style lang="sass" src="./game.sass"></style>
