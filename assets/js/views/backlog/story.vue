<template>
  <div>
    <article class="media">
      <figure v-if="isChild" class="media-left"><p class="image is-48x48"></p></figure>
      <div class="media-content">
        <div class="content">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">{{name}}</p>
                </div>
              </div>

              <div v-if="description" class="content">{{description}}</div>

              <small>
                <a v-if="!hideUp" @click="upFunction"><i class="fa fa-caret-up"></i></a>
                <a v-if="!hideDown" @click="downFunction"><i class="fa fa-caret-down"></i></a>
                <a v-if="!isChild" @click="addFunction">Add</a>
                <a @click="moveToFunction">Move To</a>
                <a @click="editFunction">Edit</a>
                <a @click="deleteFunction">Delete</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </article>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Story',

    props: ['name', 'description', 'isChild', 'addFunction', 'editFunction',
            'upFunction', 'downFunction', 'hideUp', 'hideDown', 'deleteFunction', 'moveToFunction']
  }
</script>

<style scoped=true>
  .media .media {
    border-top: 0
  }

  .card {
    margin-bottom: 10px;
  }

  .card-content small > a {
    margin-right: 5px;
  }
</style>
