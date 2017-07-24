export default {
  name: 'MessageInput',

  props: {
    sendMessage: Function
  },

  data: () => ({
    message: ''
  }),

  methods: {
    onEnterKey() {
      if (!this.message.length) {
        return
      }

      this.sendMessage(this.message)
      this.message = ''
    }
  }
}
