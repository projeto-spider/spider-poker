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
      <div class="toolbar">
        <q-toolbar-title style="text-align: center">
          1:32
        </q-toolbar-title>
      </div>

      <div class="list no-border platform-delimiter">
        <div class="list-label">Online</div>

        <div class="item">
          <gravatar email="lubien1996@gmail.com" :circle="true" class="item-primary"></gravatar>
          <div class="item-content has-secondary">
            João Ferreira
          </div>
        </div>

        <div class="item">
          <gravatar email="leonardo.chfc@gmail.com" :circle="true" class="item-primary"></gravatar>
          <div class="item-content has-secondary">
            Leonardo Costa
          </div>
          <i class="item-secondary">
            done
          </i>
        </div>

        <hr>

        <div class="list-label">Offline</div>

        <div class="item">
          <gravatar email="fake@gmail.com" :circle="true" class="item-primary"></gravatar>
          <div class="item-content">
            John Doe
          </div>
        </div>
      </div>
    </q-drawer>

    <div class="layout-view">
      <div class="layout-padding">
        <div ref="tab-chat">
          <div class="chat-other">
            <div class="chat-user">
              <gravatar email="leonardo.chfc@gmail.com"></gravatar>
            </div>
            <div class="chat-date">
              7 minutes ago
            </div>
            <div class="chat-message">
              <p>I think we should handle this story more carefully</p>
            </div>
          </div>

          <div class="chat-you">
            <div class="chat-user">
              <gravatar email="lubien1996@gmail.com"></gravatar>
            </div>
            <div class="chat-date">
              6 minutes ago
            </div>
            <div class="chat-message">
              <p>Indeed. Let's play another round.</p>
            </div>
          </div>
        </div>

        <div ref="tab-stories">Stories</div>
        <div ref="tab-events">Events</div>
      </div>
    </div>

    <q-drawer ref="rightDrawer" right-side>
      <div class="toolbar bg-secondary">
        <q-toolbar-title>
          Current Story
        </q-toolbar-title>
      </div>

      <div class="card bg-lime-2">
        <div class="card-title">
          As an authorized user I may register new organizations.
        </div>
        <div class="card-content">
          Some important note here.
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
      ></q-search>
    </div>
  </q-layout>
</template>

<script src="./game.js"></script>
<style lang="sass" src="./game.sass"></style>
