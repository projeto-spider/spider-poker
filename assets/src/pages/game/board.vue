<template>
  <div class="is-fullheight">
    <div class="columns is-fullheight">
      <div class="column board-sidebar">
        <div v-if="!votation" class="timer title is-2">
          {{padZero(timePassed.minutes)}}:{{padZero(timePassed.seconds)}}
        </div>
        <div v-if="votation">
          <div class="timer title is-2">
            {{padZero(timePassed.minutes)}}:{{padZero(timePassed.seconds)}}
          </div>
          <div class="timer votetitle is-2">
            {{padZero(votationTimePassed.minutes)}}:{{padZero(votationTimePassed.seconds)}}
          </div>
        </div>
        <div class="tabs is-centered">
          <ul>
            <li :class="{'is-active': sidebarTab === 1}" @click="() => setSidebarTab(1)"><a>Users</a></li>
            <li :class="{'is-active': sidebarTab === 2}" @click="() => setSidebarTab(2)"><a>Stories</a></li>
            <li :class="{'is-active': sidebarTab === 3}" @click="() => setSidebarTab(3)"><a>Time</a></li>
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
                      <i class="fa fa-circle"></i>
                    </span>
                    <br>
                    <small>@{{user.username}}</small>
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
                <p><strong>{{story.title}}</strong></p>
              </div>
            </div>
          </article>
          <hr/>
          <div v-if="isManager">
            <button
              v-if="!onGoing"
              @click="openStoriesModal"
              class="button is-primary is-fullwidth"
            >
              Choose a story
            </button>
            <button
              v-else
              class="button is-primary is-fullwidth is-disabled"
            >
              Choose a story
            </button>
          </div>

          <small>
            <a @click="openVotationModal"> init votation </a>
          </small>

          <br/>

          <small>
            <a @click="startDicussionTimer"> init discussion </a>
          </small>
        </div>

        <div v-if="sidebarTab === 4" class="votes">
          <article v-for="vote in votes" class="media">
            <figure class="media-left">
              <p class="image is-64x64">
                <img src="https://placeholdit.imgix.net/~text?txtsize=20&txt=Avatar&w=64&h=64&txttrack=0">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{vote.displayName}}</strong>
                  <small>@{{vote.username}}</small>
                  <small>{{vote.when}}</small>
                  <br>
                  Voted: <strong>{{vote.voted}}</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div class="column main-board">
        <p v-if="false" class="title is-spaced">
          #1 As a power user, I can specify files or folders to backup based
          on file size, date created and date modified
        </p>
        <p v-if="false" class="subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus
          ac lacus id vulputate. Integer sit amet magna feugiat, facilisis sem
          in, vehicula orci. Integer fringilla turpis congue ligula convallis,
          non auctor est scelerisque.
        </p>

        <hr v-if="false"/>

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

         <div v-if="modal.stories.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Choosing story</p>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <article v-for="(story, i) in options" class="media">
                  <label class="radio">
                  <input type="radio" @click="currentStory(story, i)">
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{story.name}}</strong>
                            <br>
                            <small>{{story.description}}</small>
                          </p>
                        </div>
                      </div>
                    </label>
                  </article>
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="chooseStory" class="button is-success">Choose</a>
                <a @click="modal.stories.open = false" class="button">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="modal.votation.open">
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Inform votation time</p>
              </header>
              <section class="modal-card-body">
                <div class="field">
                  <form
                    method="post"
                    @submit.prevent="VotationTimer"
                    @keyup.13="VotationTimer"
                  >
                    <p class="control">
                      <input
                        class="input"
                        placeholder="Votation time (min)"
                        v-model="modal.votation.time"
                      >
                    </p>
                  </form>
                </div>
                <div v-if="modal.votation.erro" class="notification is-danger">
                  <button @click="modal.votation.erro = false" class="delete"></button>
                  Something went wrong
                </div>
              </section>
              <footer class="modal-card-foot">
                <a @click="VotationTimer" class="button is-success">Start</a>
                <a @click="closeVotationModal">Cancel</a>
              </footer>
            </div>
          </div>
        </div>

        <div v-if="false" class="deck">
          <div v-for="card in deck" @click="() => select(card)" class="card" :class="cardClass(card)">
            <span v-if="card === 'Pass'">
              <i class="fa fa-forward"></i>
            </span>
            <span v-if="card === 'Coffee'">
              <i class="fa fa-coffee"/></i>
            </span>
            <span v-if="!['Pass', 'Coffee'].includes(card)">{{card}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./board.js"></script>

<style lang="sass" src="./board.sass" scoped></style>
