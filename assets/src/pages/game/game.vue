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
      <div v-if="timer" class="toolbar">
        <q-toolbar-title style="text-align: center">
          {{timer.minutes}}:{{timer.seconds}}
        </q-toolbar-title>
      </div>

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
        <div class="list-label">Online</div>

        <transition-group name="user-presence">
          <div v-for="user in online" :key="user" class="item">
            <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
            <div class="item-content has-secondary">{{user.display_name}}</div>

            <template>
              <i
                v-if="voting && votes.includes(user.id)"
                class="item-secondary"
              >
                done
              </i>

              <template v-else-if="discussion && votes[user.id]">
                <i v-if="votes[user.id] === 'time'" class="item-secondary">
                  access_time
                </i>

                <span v-else class="item-secondary">
                  {{votes[user.id]}}
                </span>
              </template>
            </template>
          </div>
        </transition-group>

        <hr>

        <div class="list-label">Offline</div>

        <transition-group name="user-presence">
          <div v-for="user in offline" :key="user" class="item">
            <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
            <div class="item-content has-secondary">{{user.display_name}}</div>
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
              <div v-if="message.user_id === 0" class="chat-date">Anonymous</div>

              <div class="chat-user">
                <gravatar :email="message.user_id === 0 ? '' : users[message.user_id].email"></gravatar>
              </div>

              <div class="chat-message">
                <p>{{message.body}}</p>
              </div>
            </div>
          </transition-group>
        </div>

        <div ref="tab-stories">
          <div v-for="(story, position) in backlog.sort((a, b) => a.estimation - b.estimation)" v-if="story" class="card card-story bg-lime-2">
            <div class="card-title">
              <template v-if="role === 'manager' && !voting && !discussion">
                <button
                  v-if="role === 'manager' && current_story != story.id"
                  @click="selectStory(story)"
                  class="clear pull-right story-button"
                  style="margin-top: -7px"
                >
                  <i>star_border</i>
                </button>

                <button v-else disabled class="clear pull-right" style="margin-top: -7px">
                  <i>star</i>
                </button>
              </template>

              <span v-if="story.estimation" class="label bg-primary text-white">
                <template v-if="story.estimation === 'time'"><i>access_time</i></template>
                <template v-else>{{story.estimation}}</template>
              </span>

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

    <q-drawer ref="rightDrawer" v-if="stories[current_story]" right-side>
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

      <p class="caption" style="padding: 5px 15px">
        <template v-if="voting">
          Choose your vote
        </template>

        <template v-else-if="discussion && role === 'manager'">
          Choose the final estimation
        </template>
      </p>

      <div
        v-if="voting || (discussion && role === 'manager')"
        class="flex wrap small-gutter cards"
        style="padding: 5px 15px"
      >
        <button
          v-for="card in [1, '1/2', 2, 3, 5, 8, 13, 20, 40, 100, '?', 'time'].filter(card => voting ? true : !isNaN(card))"
          @click="selectCard(card)"
          class="big auto"
          :class="{[selectedCard === card ? 'primary' : 'light']: true}"
          :disabled="selectedCard === card"
        >
          <template v-if="card === 'time'">
            <i>access_time</i>
          </template>

          <template v-else>
            {{card}}
          </template>
        </button>
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
