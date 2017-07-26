<template>
  <div class="card">
    <div v-if="event.type === 'user_joined'" class="card-title bg-primary text-white">
      {{event.name}} joined
    </div>

    <div v-else-if="event.type === 'story_selected' && story" class="card-title bg-secondary text-white">
      Story "{{story.title}}" selected
    </div>

    <div v-else-if="event.type === 'started_voting'" class="card-title bg-warning text-white">
      Started voting
    </div>

    <div v-else-if="event.type === 'stopped_voting'" class="card-title bg-negative text-white">
      Stopped voting
    </div>

    <div v-else-if="event.type === 'set_score'" class="card-title bg-info text-white">
      Set score to {{event.score}}
    </div>

    <div v-else-if="event.type === 'added_substories'" class="card-title bg-info text-white">
      Added substories
    </div>

    <div v-else-if="event.type === 'game_finished'" class="card-title bg-primary text-white">
      Game finished
    </div>
  </div>
</template>

<script src="./events.js"></script>
