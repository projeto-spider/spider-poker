import {Dialog} from 'quasar'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import {mapGetters} from 'vuex'
import ProjectStory from 'components/story/project-story.vue'

/*
*Google Analytics component
*Remember to setup your account ID
*/
Vue.use(VueAnalytics, {
  id: window.GA_ID
})

export default {
  name: 'Stories',

  // extends: BacklogChannel,

  components: {ProjectStory},

  props: {
    channel: [Boolean, Object],
    backlog: Array,
    isManager: Boolean,
    promptNewPosition: Function,
    promptStoryUpdate: Function,
    confirmStoryDeletion: Function,
    startGame: Function
  },

  data: () => ({
    /* Adding Story */
    title: '',
    description: ''
  }),

  computed: {
    ...mapGetters(['loggedUser', 'socketConnected', 'inGame']),
    ...mapGetters({
      project: 'selectedProject'
    }),

    hasPo() {
      return !!this.project.po_id
    }
  },

  methods: {
    unshiftStory() {
      if (this.title === '') {
        return
      }

      const {title, description} = this
      this.title = ''
      this.description = ''

      this.channel.push('story:unshift', {title, description})
    }
  }
}
