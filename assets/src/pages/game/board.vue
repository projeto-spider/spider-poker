<template>
  <div class="is-fullheight">
    <div class="columns is-fullheight">
      <div class="column board-sidebar">
        <div v-if="timer" class="has-text-centered">
          <span class="title">{{timer.minutes}}:{{timer.seconds}}</span>
        </div>

        <div class="tabs is-centered">
          <ul>
            <li :class="{'is-active': sidebarTab === 1}" @click="() => setSidebarTab(1)"><a>Users</a></li>
            <li :class="{'is-active': sidebarTab === 2}" @click="() => setSidebarTab(2)"><a>Stories</a></li>
          </ul>
        </div>

        <div v-if="sidebarTab === 1" class="connected-users">
          <transition-group name="flip-list" tag="div">
            <article v-for="user in users" :key="user.id" class="media">
              <figure class="media-left">
                <p class="image is-48x48">
                  <gravatar :email="user.email" :size="48"></gravatar>
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{user.display_name}}</strong>
                    <span class="icon is-small" :class="{'is-online': user.online, 'is-offline': !user.online}">
                      <i class="fa" :class="{[user.vote ? 'fa-check' : 'fa-circle']: true}"></i>
                    </span>
                    <br>
                    <span
                      v-if="game.state !== STATE.VOTING && user.vote"
                      class="tag is-medium"
                      :class="{[votesColor]: true}"
                    >
                      <template v-if="user.vote === 'Pass'">
                        <span class="icon is-small">
                          <i class="fa fa-pause"></i>
                        </span>
                      </template>
                      <template v-else-if="user.vote === 'Coffee'">
                        <span class="icon is-small">
                          <i class="fa fa-coffee"></i>
                        </span>
                      </template>
                      <template v-else>
                        {{user.vote}}
                      </template>
                    </span>
                  </p>
                </div>
              </div>
            </article>
          </transition-group>
        </div>

        <div v-if="sidebarTab === 2" class="backlog">
          <article v-for="story in stories" class="media">
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{story.title}}</strong>
                  <br>

                  <template v-if="game.scores && game.scores[story.id]">
                    <template v-if="game.scores[story.id] === 'Pass'">
                      <span class="icon is-small">
                        <i class="fa fa-pause"></i>
                      </span>
                    </template>

                    <template v-else-if="game.scores[story.id] === 'Coffee'">
                      <span class="icon is-small">
                        <i class="fa fa-coffee"></i>
                      </span>
                    </template>

                    <template v-else>
                      {{game.scores[story.id]}}
                    </template>
                  </template>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="column main-board">
        <section v-if="currentStory" class="hero is-primary">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">{{currentStory.title}}</h1>
              <h2 v-show="currentStory.description" class="subtitle">
                {{currentStory.description}}
              </h2>
            </div>
          </div>
        </section>

        <div v-if="isManager" class="manager-controls">
          <div class="block">
            <button
              @click="openSelectStoryModal"
              class="button is-primary"
            >
              Select story
            </button>

            <button
              v-if="game.current_story && (game.state === STATE.CREATED || game.state === STATE.IDLE || game.state === STATE.DISCUSSION)"
              @click="startVoting"
              class="button is-info"
            >
              Start voting
            </button>

            <button
              v-if="game.state === STATE.VOTING"
              @click="stopVoting"
              class="button is-danger"
            >
              Stop voting
            </button>
          </div>
        </div>

        <div
          v-if="game.state === STATE.VOTING || (game.state === STATE.DISCUSSION && isManager)"
          class="manager-controls"
        >
          <div class="block">
            <button
              v-for="card in deck"
              @click="() => selectCard(card)"
              class="button"
            >
              {{card}}
            </button>
          </div>
        </div>

        <div class="chat-input">
          <div class="field">
            <p class="control">
              <input v-model="message" @keyup.enter="sendMessage" class="input is-medium" type="text" placeholder="Message">
            </p>
          </div>
        </div>

        <div class="chat">
          <div v-for="message in messages">
            <message
              :body="message.body"
              :user="message.user"
              :fromSelf="message.user_id === loggedUser.id"
            >
            </message>
          </div>
        </div>

        <div v-if="isManager">
          <div class="modal" :class="{'is-active': modalSelectStory}">
            <div @click="closeSelectStoryModal" class="modal-background"></div>

            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Choose a Story</p>
                <button @click="closeSelectStoryModal" class="delete"></button>
              </header>

              <section class="modal-card-body">
                <article
                  v-for="story in stories"
                  @click="() => selectStory(story)"
                  class="media is-clickable"
                >
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <strong>
                          {{story.title}}

                          <template v-if="game.scores && game.scores[story.id]">
                            <template v-if="game.scores[story.id] === 'Pass'">
                              <span class="icon is-small">
                                [<i class="fa fa-pause"></i>]
                              </span>
                            </template>

                            <template v-else-if="game.scores[story.id] === 'Coffee'">
                              <span class="icon is-small">
                                [<i class="fa fa-coffee"></i>]
                              </span>
                            </template>

                            <template v-else>
                              [{{game.scores[story.id]}}]
                            </template>
                          </template>
                        </strong>

                        <br>

                        {{story.description}}
                      </p>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./board.js"></script>

<style lang="sass" src="./board.sass" scoped></style>
