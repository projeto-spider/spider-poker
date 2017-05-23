import {Gravatar} from 'app/components'

export default {
  name: 'UserBlock',

  components: {Gravatar},

  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
