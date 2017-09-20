<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button @click="modal.close()">
        <i>keyboard_arrow_left</i>
      </button>
      <q-toolbar-title :padding="1">Games History</q-toolbar-title>
    </div>

    <div class="layout-view">
      <div class="layout-padding">
        <h3 v-if="games.length === 0 && !hasMoreGames">No games</h3>

        <div v-if="games.length" class="list">
          <div v-for="game in games" :key="game.id" @click="selectGame(game.id)" class="item item-link two-lines">
            <div class="item-content has-secondary">
              <div>{{game.story_title}}</div>
              <div>{{(new Date(game.inserted_at)).toLocaleString()}}</div>
            </div>
          </div>
        </div>

        <button
          :disabled="loading"
          v-if="hasMoreGames"
          class="primary full-width"
          style="margin-top: 10px"
          @click="moreGames"
        >
          Load More
        </button>
      </div>
    </div>

    <q-modal ref="messagesModal" class="maximized">
      <q-layout>
        <div slot="header" class="toolbar">
          <button @click="modal.close()">
            <i>keyboard_arrow_left</i>
          </button>
          <q-toolbar-title :padding="1">Messages</q-toolbar-title>
        </div>

        <div class="layout-view">
          <div class="layout-padding">
            <h3 v-if="messages.length === 0 && !hasMoreMessages">No messages</h3>

            <div v-for="message in messages" :key="message">
              <message :message="message"></message>
            </div>

            <button
              :disabled="loading"
              v-if="hasMoreMessages"
              class="primary full-width"
              style="margin-top: 10px"
              @click="moreMessages"
            >
              Load More
            </button>
          </div>
        </div>
      </q-layout>
    </q-modal>
  </q-layout>
</template>

<script src="./modal.js"></script>
