export default {
  name: 'ErrorableInput',

  props: {
    type: {
      type: String,
      default: 'text'
    },

    value: {
      default: ''
    },

    errors: Array,

    icon: String,

    placeholder: String
  },

  data() {
    return {
      inputValue: this.value
    }
  },

  computed: {
    errored() {
      return this.errors.length > 0
    },

    inputClass() {
      return {
        'is-danger': this.errored
      }
    },

    iconClass() {
      return {
        [`fa-${this.icon}`]: true
      }
    }
  },

  methods: {
    input() {
      this.$emit('input', this.inputValue)
    }
  }
}
