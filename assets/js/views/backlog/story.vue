<template>
  <div>
    <article class="media">
      <figure v-if="isChild" class="media-left"><p class="image is-48x48"></p></figure>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{name}}</strong>
            <br>
            <small>
            <p v-if="description">{{description}}</p>
            <br>
            <a>
              <i class="fa fa-caret-up"></i>
            </a> &nbsp;
            <a>
              <i class="fa fa-caret-down"></i>
            </a> &nbsp; &nbsp;● &nbsp;
            <a>
              Add
            </a> &nbsp;
            <a
              @click="editFunction"
            >
              Edit
            </a> &nbsp;
            <a
              type="submit"
            >
              Delete
            </a>
            </small>
          </p>
        </div>
      </div>
    </article>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Story',

    props: ['name', 'description', 'isChild', 'editFunction']
  }
</script>
