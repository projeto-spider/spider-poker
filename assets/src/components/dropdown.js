import {always} from 'ramda'
import MyVueDropdown from 'vue-my-dropdown'

export default {
  name: 'Dropdown',

  components: {MyVueDropdown},

  props: {
    startOpen: {
      type: Boolean,
      default: false
    },

    position: {
      type: Array,
      default: always(['right', 'top', 'left', 'bottom'])
    },

    animation: {
      type: String,
      default: 'ani-slide'
    },

    click: {
      type: Function,
      default() {
        this.open = !this.open
      }
    },

    clickOut: {
      type: Function,
      default() {
        this.open = false
      }
    }
  },

  data: () => ({
    open: false
  }),

  methods: {
    handleClick() {
      this.click()
    },

    handleClickOut() {
      this.clickOut()
    }
  },

  create() {
    if (this.startOpen) {
      this.open = true
    }
  }
}
