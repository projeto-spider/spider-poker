<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>

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
    </q-tabs>

    <q-drawer ref="leftDrawer">
      <div v-if="timer" class="toolbar">
        <q-toolbar-title style="text-align: center">
          {{timer.minutes}}:{{timer.seconds}}
        </q-toolbar-title>
      </div>

      <div v-if="users" class="list no-border platform-delimiter">
        <div class="list-label">Online</div>

        <transition-group name="user-presence">
          <div v-for="user in online" :key="user" class="item">
            <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
            <div class="item-content has-secondary">{{user.display_name}}</div>

            <i class="item-secondary">
              done
            </i>
          </div>
        </transition-group>

        <hr>

        <div class="list-label">Offline</div>

        <transition-group name="user-presence">
          <div v-for="user in offline" :key="user" class="item">
            <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
            <div class="item-content has-secondary">{{user.display_name}}</div>

            <i class="item-secondary">
              done
            </i>
          </div>
        </transition-group>
      </div>
    </q-drawer>

    <div ref="layout-view" class="layout-view">
      <div ref="layout-padding" class="layout-padding">
        <div ref="tab-chat" class="tab-chat">
          <transition-group name="user-presence">
            <div
              v-for="message in messages"
              :key="message"
              class="chat-message"
              :class="{[message.user_id === loggedUser.id ? 'chat-you' : 'chat-other']: true}"
            >
              <div class="chat-user">
                <gravatar :email="users[message.user_id].email"></gravatar>
              </div>

              <div class="chat-message">
                <p>{{message.body}}</p>
              </div>
            </div>
          </transition-group>
        </div>

        <div ref="tab-stories">
          <div v-for="(story, position) in backlog" v-bind:key="story" class="card card-story bg-lime-2">
            <div class="card-title">

              <button v-if="role === 'manager'" ref="target" class="clear pull-right story-button">
                <i>more_vert</i>

                <q-popover ref="popover">
                  <div class="list item-delimiter highlight">
                    <div
                      v-if="current_story !== story.id"
                      class="item item-link"
                      @click="selectStory(story), $refs.popover[position].close()"
                    >
                      <div class="item-content">Select</div>
                    </div>
                  </div>
                </q-popover>
              </button>
              {{story.title}}
            </div>

            <div v-if="story.description" class="card-content">
              {{story.description}}
            </div>
          </div>
        </div>
        <div ref="tab-events">Events</div>
      </div>
    </div>

    <q-drawer ref="rightDrawer" v-if="current_story" right-side>
      <div class="toolbar bg-secondary">
        <q-toolbar-title>
          Current Story
        </q-toolbar-title>
      </div>

      <div class="card bg-lime-2">
        <div class="card-title">
          {{stories[current_story].title}}
        </div>
        <div v-if="stories[current_story].description" class="card-content">
          {{stories[current_story].description}}
        </div>
      </div>

      <div class="flex wrap small-gutter cards" style="padding: 5px 15px">
          <button class="light big auto">0</button>
          <button class="light big auto">1/2</button>
          <button class="light big auto">1</button>
          <button class="light big auto">2</button>
          <button class="light big auto">3</button>
          <button class="light big auto">5</button>
          <button class="light big auto">8</button>
          <button class="light big auto">13</button>
          <button class="light big auto">20</button>
          <button class="light big auto">40</button>
          <button class="light big auto">100</button>
          <button class="light big auto">?</button>
          <button class="light big auto"><i>access_time</i></button>
      </div>
    </q-drawer>

    <div slot="footer" class="toolbar">
      <q-search
        v-model="message"
        :debounce="0"
        placeholder="Type your messages"
        icon="send"
        class="primary"
        @enter="sendMessage"
      ></q-search>
    </div>
  </q-layout>
</template>

<script src="./game.js"></script>
<style lang="sass" src="./game.sass"></style>
