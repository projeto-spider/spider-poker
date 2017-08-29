import {mapGetters} from 'vuex'
import Story from './story.vue'

export default {
  name: 'ProjectStory',

  components: {Story},

  props: {
    story: Object,
    isChild: Boolean,
    promptNewPosition: Function,
    promptStoryUpdate: Function,
    confirmStoryDeletion: Function,
    startGame: Function
  },

  computed: {
    ...mapGetters(['inGame', 'selectedProject', 'loggedUser']),

    isManager() {
      return this.selectedProject.manager_id === this.loggedUser.id
    }
  }
}
