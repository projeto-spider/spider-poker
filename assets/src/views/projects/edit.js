import R from 'ramda'
import {Projects} from 'app/api'
import {insertChangesetErrors} from 'app/utils'
import {HeroTitle, FormControl} from 'app/components'

const emptyErrors = {
  displayName: [],
  description: [],
  private: []
}

const projectIdView = R.view(R.lensPath(['project', 'id']))

export default {
  name: 'ProjectEditView',

  components: {
    HeroTitle, FormControl
  },

  data() {
    return {
      status: 'not-asked',

      project: null,
      private: '',

      errors: emptyErrors
    }
  },

  async created() {
    this.status = 'loading'

    const {data: proj} = await Projects.show(this.$route.params.project)

    if (proj.length === 0) {
      this.status = 'errored'
      return
    }
    this.status = 'success'

    this.project = proj[0]
  },

  methods: {
    async submit() {
      if (this.status === 'loading') {
        return
      }

      this.status = 'loading'

      const projId = projectIdView(this)

      const attributes = R.pipe(
        R.view(R.lensPath(['project'])),
        R.pick(['displayName', 'description', 'private'])
      )(this)

      try {
        await Projects.update(projId, attributes)

        this.status = 'success'

        this.errors = emptyErrors
        this.$router.push({name: 'projectShow'})
      } catch (res) {
        this.errors = insertChangesetErrors(res.errors)(emptyErrors)

        this.status = 'errored'
      }
    },

    async deleteProject() {
      if (confirm('Are you sure you want to delete this project?')) {
        const projId = projectIdView(this)

        await Projects.delete(projId)

        this.$router.push({name: 'home'})
      }
    }
  }
}
