import {AppFullscreen} from 'quasar'
import Gravatar from 'components/gravatar.vue'

export default {
  name: 'Game',

  components: {Gravatar},

  data: () => ({
    /* Chat */
    message: ''
  }),

  methods: {
    /* Full Screen */
    tryFullScreen() {
      if (AppFullscreen.isActive()) {
        return AppFullscreen.toggle()
      }

      AppFullscreen.request()
    }
  }
}
