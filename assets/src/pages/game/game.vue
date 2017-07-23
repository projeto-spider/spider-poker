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
          <template v-for="(story, position) in backlog">
            <div v-if="story" class="card card-story bg-lime-2">
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
              v-if="child" 
              class="card card-story bg-lime-4" 
              style="left: 15px"
            >
            </game-story>
          </template>
        </div>

        <div ref="tab-events">
          <template v-for="ev in events">
            <div class="card">
              <div v-if="ev.type === 'user_joined'" class="card-title bg-primary text-white">
                {{ev.name}} joined
              </div>

              <div v-else-if="ev.type === 'story_selected' && stories[ev.story_id]" class="card-title bg-secondary text-white">
                Story "{{stories[ev.story_id].title}}" selected
              </div>

              <div v-else-if="ev.type === 'started_voting'" class="card-title bg-warning text-white">
                Started voting
              </div>

              <div v-else-if="ev.type === 'stopped_voting'" class="card-title bg-negative text-white">
                Stopped voting
              </div>

              <div v-else-if="ev.type === 'set_score'" class="card-title bg-info text-white">
                Set score to {{ev.score}}
              </div>

              <div v-else-if="ev.type === 'added_substories'" class="card-title bg-info text-white">
                Added substories
              </div>

              <div v-else-if="ev.type === 'game_finished'" class="card-title bg-primary text-white">
                Game finished
              </div>
            </div>
          </template>
        </div>
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

      <template v-if="discussion && role === 'manager' && order.find(id => id === current_story)">
        <p class="caption" style="padding: 5px 15px">
          ...Or separate it into stories.
        </p>

        <div v-for="(model, i) in substories" :key="`substory-${i}`" class="stacked-label" style="padding: 5px 15px">
          <input class="full-width" v-model="substories[i]">
          <button @click.prevent="substories.splice(i, 1)" :disabled="substories.length === 1" class="negative pull-right">Remove</button>
        </div>

        <div style="padding: 0 15px">
          <button @click.prevent="substories.push('')" class="secondary"><i>add</i> More</button>
          <button @click.prevent="createSubstories" :disabled="substories.length === 1 && substories[0].trim() === ''" class="primary"><i>done</i> Create</button>
        </div>
      </template>
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
