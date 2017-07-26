<template>
  <div>
    <div class="toolbar bg-secondary">
      <q-toolbar-title>
        Current Story
      </q-toolbar-title>
    </div>

    <div class="card bg-lime-2">
      <div class="card-title">
        {{selectedStory.title}}
      </div>
      <div v-if="selectedStory.description" class="card-content">
        {{selectedStory.description}}
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
        v-for="card in cardsAvaible"
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
  </div>
</template>

<script src="./votation-drawer.js"></script>

<style lang="sass" src="./votation-drawer.sass"></style>
