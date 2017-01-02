<template lang="pug">
  .form-group.has-feedback(':class'="groupClass")
    input(
      v-if='type === "email"'
      type='email',
      class="form-control",
      'v-model'="inputValue"
      '@input'="input"
      ':placeholder'='placeholder'
    )
    input(
      v-if='type === "password"'
      type='password',
      class="form-control",
      'v-model'="inputValue"
      '@input'="input"
      ':placeholder'='placeholder'
    )
    input(
      v-if='type === "text"'
      type='text',
      class="form-control",
      'v-model'="inputValue"
      '@input'="input"
      ':placeholder'='placeholder'
    )
    span(class="glyphicon form-control-feedback", 'v-bind:class'='iconClass')
    span(v-for="error in errors", class="help-block") {{error}}
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
      groupClass() {
        return {
          'has-error': this.errors.length > 0,
        };
      },
      iconClass() {
        const iconName = `glyphicon-${this.icon}`;

        return {
          [iconName]: true
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
