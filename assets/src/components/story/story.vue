<template>
  <div>
    <div class="card-title">
      <span v-if="!story.children.length && story.estimation" class="label bg-primary text-white">
        <template v-if="story.estimation === 'time'"><i>access_time</i></template>
        <template v-else>{{estimation}}</template>
      </span>

      <span v-if="story.children.length" class="label bg-primary text-white">
        {{
            story.children
              .map(child => child.estimation || 0)
              .reduce((x, y) => x + y)
        }}
      </span>
      {{story.title}}
      <slot name="rigth-button"></slot>
    </div>
    <div v-if="story.description" class="card-content">{{story.description}}</div>
  </div>
</template>

<script src="./story.js"></script>
