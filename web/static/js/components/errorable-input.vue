<template>
  <div class='control has-icon'>
    <input
      v-if="type === 'email'"
      type="email"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <input
      v-if="type === 'password'"
      type="password"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <input
      v-if="type === 'text'"
      type="text"
      class="input"
      :class="inputClass"
      v-model="inputValue"
      @input="input"
      :placeholder="placeholder"
    />

    <span class="icon is-small">
      <i class="fa" :class="iconClass"></i>
    </span>

    <span v-for="error in errors" class="help is-danger">{{error}}</span>
  </div>
</template>

<script>
  export default {
    name: 'ErrorableInput',

    props: {
      type: {
        type: String,
        default: 'text',
      },

      value: {
        default: '',
      },

      errors: Array,

      icon: String,

      placeholder: String,
    },

    data() {
      return {
        inputValue: '',
      }
    },

    computed: {
      errored() {
        return this.errors.length > 0
      },

      inputClass() {
        return {
          'is-danger': this.errored,
        };
      },

      iconClass() {
        return {
          [`fa-${this.icon}`]: true
        };
      }
    },

    methods: {
      input() {
        this.$emit('input', this.inputValue);
      }
    },
  }
</script>
